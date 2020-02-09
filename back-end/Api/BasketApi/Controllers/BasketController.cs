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
         */
        [HttpPost]
        [Route("/add")]
        public async Task<IActionResult> AddDoc([FromBody] Basket newBasketItem)
        {
            if (!newBasketItem.Uid.HasValue)
                newBasketItem.Uid = Guid.NewGuid();

            var response = await _bucket.UpsertAsync(newBasketItem.Uid.ToString(), newBasketItem);

            if (!response.Success)
                return BadRequest(newBasketItem);

            return Ok(newBasketItem);
        }

        /*
         * Route to retrieve a users basket if one exists. If the user does not have
         * a basket document a HTTP status code 404 NOT FOUND will be returned.
         * GET /api/basket/find
         */
        [HttpGet]
        [Route("find/{uid}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> LookupDoc(Guid uid)
        {
            var queryRequest = new QueryRequest()
                .Statement("SELECT * FROM Basket WHERE uid = $uid")
                .AddNamedParameter("$uid", uid);

            var result = await _bucket.QueryAsync<dynamic>(queryRequest);

            if (!result.Success) return NotFound();

            return Ok(result);
        }

        /*
         * Route to be used when a user finalizes a purchase or when they remove
         * the last item from the basket.
         * DELETE /api/basket/delete
         */
        [HttpDelete]
        [Route("/delete/{uid}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> DeleteDoc(Guid uid)
        {
            var result = await _bucket.RemoveAsync(uid.ToString());

            if (!result.Success) return NotFound();

            return Ok();
        }

        /*
         * Route to use when a user adds or removes an item from an already existing basket.
         * PUT /api/basket/update
         */
        [HttpPut]
        [Route("/update")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> UpdateDoc([FromBody] Basket updateItem)
        {
            var result = await _bucket.UpsertAsync(updateItem.Uid.ToString(), updateItem);

            if (!result.Success) return NotFound();

            return Ok();
        }
    }
}
