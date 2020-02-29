using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Couchbase;
using Couchbase.Core;
using Couchbase.Extensions.DependencyInjection;
using BasketApi.Model;
using System.Net;
using Couchbase.N1QL;
using Microsoft.AspNetCore.Authorization;

namespace UserInfoApi.Controllers
{
    /* BASKET MICROSERVICE - In the care of an error a 404 Not Found or 400 Bad Request will be returned.
     *                       Eventually once we have authorization working, is a user is not authorized
     *                       a HTTP status code 401 Unauthorized will be returned automatically if
     *                       they are not authorized by the APIGateway.
     */
    [Authorize]
    [Route("api/basket/")]
    [ApiController]
    public class BasketController : Controller
    {
        private IBucket _bucket;

        public BasketController(IBucketProvider bucketProvider)
        {
            // singleton that is the DB bucket similar to MySQL
            _bucket = bucketProvider.GetBucket("Basket");
        }

        /*
         * Route should be used when user has an empty basket and adds
         * their first item
         * POST /api/basket/add
         * need to consider adding the same item from the prodcut page
         * need to look at all of the offering ids in the document if it exists
         * and replace it if it does
         */
        [HttpPost, Route("add")]
        public async Task<IActionResult> AddDoc([FromBody] Basket newBasketItem)
        {
            if (ModelState.IsValid)
            {
                var currentUser = HttpContext.User;

                if (!currentUser.HasClaim(c => c.Type == "user_id"))
                    return BadRequest();

                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

                var doc = await _bucket.GetAsync<Basket>(ID);

                if (!doc.Success)
                {
                    if (!newBasketItem.Uid.HasValue)
                        newBasketItem.Uid = Guid.NewGuid();
                    newBasketItem.total_items = newBasketItem.Offerings.Count();
                    var response = await _bucket.UpsertAsync(ID, newBasketItem);
                    if (!response.Success)
                        return BadRequest(newBasketItem);
                    return Ok(newBasketItem);
                }

                Basket userDoc = doc.Value;
                userDoc.Offerings.Add(newBasketItem.Offerings[0]);
                userDoc.total_items = userDoc.Offerings.Count();
                var result = await _bucket.UpsertAsync(ID, userDoc);

                if (!result.Success)
                    return BadRequest(newBasketItem);

                return Ok(newBasketItem);
            }

            return Conflict();
        }

        /*
         * Route to retrieve a users basket if one exists. If the user does not have
         * a basket document a HTTP status code 404 NOT FOUND will be returned.
         * GET /api/basket/find
         */
        [HttpGet, Route("find")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> LookupDoc()
        {
            var currentUser = HttpContext.User;

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return BadRequest();

            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

            var result = await _bucket.GetAsync<Basket>(ID);

            if (!result.Success)
                return NotFound();

            return Ok(result.Value);
        }

        /*
         * Route to be used when a user finalizes a purchase or when they remove
         * the last item from the basket.
         * DELETE /api/basket/delete
         */
        [HttpDelete, Route("delete")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> DeleteDoc()
        {
            var currentUser = HttpContext.User;

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return BadRequest();

            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

            var result = await _bucket.RemoveAsync(ID);

            if (!result.Success)
                return NotFound();

            return Ok();
        }

        /*
         * Route to use when a user adds or removes an item from an already existing basket.
         * PUT /api/basket/update
         */
        [HttpPut, Route("update")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> UpdateDoc([FromBody] Basket updateItem)
        {
            if (ModelState.IsValid)
            {
                var currentUser = HttpContext.User;

                if (!currentUser.HasClaim(c => c.Type == "user_id"))
                    return BadRequest();

                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

                var result = await _bucket.UpsertAsync(ID, updateItem);

                if (!result.Success)
                    return NotFound();

                return Ok(result);
            }

            return BadRequest();
        }
    }
}
