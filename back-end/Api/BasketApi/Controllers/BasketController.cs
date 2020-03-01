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
            // check if the model binds correctly
            if (ModelState.IsValid)
            {
                // get the information about the current user from the HTTP context
                var currentUser = HttpContext.User;

                // check to make sure the current user has a user_id from the decrypted authorization token
                if (!currentUser.HasClaim(c => c.Type == "user_id"))
                    return BadRequest();

                // get the value of the user_id
                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

                // check to see if a document for the user exists or not
                var doc = await _bucket.GetAsync<Basket>(ID);

                // if the user doesn't already have a basket document make a new one
                if (!doc.Success)
                {
                    // check to see if the GUID is set or not
                    if (!newBasketItem.Uid.HasValue)
                        newBasketItem.Uid = Guid.NewGuid();
                    // update the total number of offerings count in the document
                    newBasketItem.total_items = newBasketItem.Offerings.Count();
                    // attempt to insert the new document
                    var response = await _bucket.UpsertAsync(ID, newBasketItem);
                    // return a BadReuqest if this fails
                    if (!response.Success)
                        return BadRequest(newBasketItem);
                    // otherwise return 200 OK
                    return Ok(newBasketItem);
                }

                Basket userDoc = doc.Value;
                //                userDoc.Offerings.Add(newBasketItem.Offerings[0]);
                // find if the product offering already exists, if it does replace it with the new one
                var userOffering = userDoc.Offerings.First(i => i.Offering_key == newBasketItem.Offerings[0].Offering_key);

                // get the index of duplicate item currently stored in the basket doc if it eists
                var index = userDoc.Offerings.IndexOf(userOffering);

                // if there is a duplicate item add the quantities together
                if (index != -1)
                    userDoc.Offerings[index].Quantity += newBasketItem.Offerings[0].Quantity;

                // if there isn't a duplicate item insert the new item being added at the beginning of the list
                else
                    userDoc.Offerings.Prepend(newBasketItem.Offerings[0]);

                // update the total count of the number of offerings stored in the document
                userDoc.total_items = userDoc.Offerings.Count();

                // attempt to insert the updated document into the Basket bucket
                var result = await _bucket.UpsertAsync(ID, userDoc);

                // if the upsert fails return a bad request
                if (!result.Success)
                    return BadRequest(newBasketItem);

                // if document was successfully replaced return 200 OK
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
        [HttpPut, Route("update/{offeringId}/{quant}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> UpdateDoc(string offeringId, int quant)
        {
            if (offeringId == null)
                return BadRequest();

            var currentUser = HttpContext.User;

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return BadRequest();

            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

            var result = await _bucket.GetAsync<Basket>(ID);
            if (!result.Success)
                return NotFound();

            Basket doc = result.Value;
            var userOffering = doc.Offerings.First(i => i.Offering_key == offeringId);
            var index = doc.Offerings.IndexOf(userOffering);

            if (index != -1)
            {
                if (quant > 0) doc.Offerings[index].Quantity = quant;
                else doc.Offerings.Remove(userOffering);

                var upsertResult = await _bucket.UpsertAsync(ID, doc);
                if (!result.Success)
                    return NotFound();

                return Ok();
            }
            else
                return NotFound(offeringId);
        }
    }
}
