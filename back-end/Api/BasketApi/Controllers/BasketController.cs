﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Couchbase.Core;
using Couchbase.IO;
using Couchbase.Extensions.DependencyInjection;
using BasketApi.Model;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using BasketApi.BasketApiErrors;

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
                    return BadRequest(new BadRequestError("Unable to find users_id from token"));
                
                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value; // get the value of the user_id
               
                var doc = await _bucket.GetAsync<Basket>(ID);   // check to see if a document for the user exists or not
               
                if (!doc.Success) // if the user doesn't already have a basket document make a new one
                {
                    // check to see if the GUID is set or not
                    if (newBasketItem.Uid == null)
                        newBasketItem.Uid = Guid.NewGuid();
                    // update the total number of offerings count in the document
                    newBasketItem.total_items = newBasketItem.Offerings.Count();

                    newBasketItem.total_cost = newBasketItem.Offerings[0].Unit_retail * newBasketItem.Offerings[0].Quantity;
                    newBasketItem.Offerings[0].totalOfferingCost = newBasketItem.total_cost;
                    // attempt to insert the new document
                    var response = await _bucket.UpsertAsync(ID, newBasketItem);
                    // return a BadReuqest if this fails
                    if (!response.Success)
                        return BadRequest(newBasketItem);
                    // otherwise return 200 OK
                    return Ok(response.ToString());
                }

                Basket userDoc = doc.Value;

                // find if the product offering already exists, if it does replace it with the new one

                if (userDoc.Offerings.Exists(i => i.Offering_key == newBasketItem.Offerings[0].Offering_key))
                {
                    Offerings userOffering = userDoc.Offerings.Find(i => i.Offering_key == newBasketItem.Offerings[0].Offering_key);

                    // get the index of duplicate item currently stored in the basket doc if it eists
                    var index = userDoc.Offerings.IndexOf(userOffering, 0);

                    // if there is a duplicate item add the quantities together
                    if (index != -1)
                    {
                        userDoc.total_cost += newBasketItem.Offerings[0].Unit_retail * newBasketItem.Offerings[0].Quantity;
                        userDoc.Offerings[index].Quantity += newBasketItem.Offerings[0].Quantity;
                        userDoc.Offerings[index].totalOfferingCost = newBasketItem.Offerings[0].Unit_retail * userDoc.Offerings[index].Quantity;
                    }
                }
                else // if there isn't a duplicate item insert the new item being added at the beginning of the list
                {
                    userDoc.total_cost += newBasketItem.Offerings[0].Unit_retail * newBasketItem.Offerings[0].Quantity;
                    newBasketItem.Offerings[0].totalOfferingCost = newBasketItem.Offerings[0].Unit_retail * newBasketItem.Offerings[0].Quantity;
                    userDoc.Offerings = userDoc.Offerings.Prepend(newBasketItem.Offerings[0]).ToList();
                }

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

        [HttpPost, Route("addWDisc")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> AddDocDiscount([FromBody] BasketDisc basket)
        {
            // check if the model binds correctly
            if (ModelState.IsValid)
            {
                // get the information about the current user from the HTTP context
                var currentUser = HttpContext.User;

                // check to make sure the current user has a user_id from the decrypted authorization token
                if (!currentUser.HasClaim(c => c.Type == "user_id"))
                    return BadRequest(new BadRequestError("Unable to find users_id from token"));

                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value; // get the value of the user_id

                var doc = await _bucket.GetAsync<BasketDisc>(ID);   // check to see if a document for the user exists or not

                if (!doc.Success) // if the user doesn't already have a basket document make a new one
                {
                    // check to see if the GUID is set or not
                    if (!basket.Uid.HasValue)
                        basket.Uid = Guid.NewGuid();
                    // update the total number of offerings count in the document
                    basket.total_items = basket.OfferingsDisc.Count();
                    // attempt to insert the new document
                    var response = await _bucket.UpsertAsync(ID, basket);
                    // return a BadReuqest if this fails
                    if (!response.Success)
                        return BadRequest(basket);
                    // otherwise return 200 OK
                    return Ok(response.ToString());
                }

                BasketDisc userDoc = doc.Value;

                // find if the product offering already exists, if it does replace it with the new one
                if (userDoc.OfferingsDisc.Exists(i => i.Offering_key == basket.OfferingsDisc[0].Offering_key))
                {
                    OfferingsDisc userOffering = userDoc.OfferingsDisc.Find(i => i.Offering_key == basket.OfferingsDisc[0].Offering_key);
                    // get the index of duplicate item currently stored in the basket doc if it eists
                    var index = userDoc.OfferingsDisc.IndexOf(userOffering, 0);

                    // if there is a duplicate item add the quantities together
                    if (index != -1)
                        userDoc.OfferingsDisc[index].Quantity += basket.OfferingsDisc[0].Quantity;
                }
                else // if there isn't a duplicate item insert the new item being added at the beginning of the list
                {
                    userDoc.OfferingsDisc = userDoc.OfferingsDisc.Prepend(basket.OfferingsDisc[0]).ToList();
                }

                // update the total count of the number of offerings stored in the document
                userDoc.total_items = userDoc.OfferingsDisc.Count();

                // attempt to insert the updated document into the Basket bucket
                var result = await _bucket.UpsertAsync(ID, userDoc);

                // if the upsert fails return a bad request
                if (!result.Success)
                    return BadRequest(basket);

                // if document was successfully replaced return 200 OK
                return Ok(basket);
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
            {
                if (result.Status == ResponseStatus.KeyNotFound)
                    return NotFound(new NotFoundError($"No document exists for {ID}"));
                else
                    return NotFound();
            }

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

            Console.WriteLine("IN DELETE");

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return BadRequest();

            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

            var result = await _bucket.RemoveAsync(ID);

            if (!result.Success)
                return StatusCode(503, new ServiceUnavailableError("Unable to add document to database."));

            return Ok("DELETED DOC");
        }

        /*
         * Route to use when a user adds or removes an item from an already existing basket.
         * PUT /api/basket/update/{offeringId}/{quant}
         * if the quantity is > 0 the quantity of the offering matching {offeringId}
         * will be updated with {quant}. If the {quant} is 0 the offering matching
         * {offeringId} will be removed from the list of Offerings
         */
        [HttpPut, Route("update/{offeringId}/{quant}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> UpdateDoc(string offeringId, int quant)
        {
            if (offeringId == null)
                return BadRequest(new BadRequestError("Request has missing offeringId in URI."));

            var currentUser = HttpContext.User;

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return BadRequest();

            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

            // get the current docutment for the user from the database
            var result = await _bucket.GetAsync<Basket>(ID);
            if (!result.Success)
                return NotFound(new NotFoundError($"No document found for user {ID}"));

            // assign the value of the docuemnt returned to a type Basket
            Basket doc = result.Value;

            if (doc.Offerings.Exists(i => i.Offering_key == offeringId))
            {
                // find the offering in the Basket.Offerings list that matches offeringId
                var userOffering = doc.Offerings.First(i => i.Offering_key == offeringId);
                // get the index of offering that matches
                var index = doc.Offerings.IndexOf(userOffering);

                // if the index was found
                if (index != -1)
                {
                    // if the quant > 0 set the quantity to quant
                    if (quant > 0)
                    {
                        doc.total_cost -= doc.Offerings[index].Unit_retail * doc.Offerings[index].Quantity;
                        doc.Offerings[index].Quantity = quant;                        
                        doc.Offerings[index].totalOfferingCost = doc.Offerings[index].Unit_retail * doc.Offerings[index].Quantity;
                        doc.total_cost += doc.Offerings[index].totalOfferingCost;
                    }
                    // if quant = 0 remove that offering from Basket.Offerings
                    else
                    {
                        doc.total_cost -= userOffering.totalOfferingCost;
                        doc.Offerings.Remove(userOffering);
                        doc.total_items = doc.Offerings.Count();
                    }

                    if (doc.total_items >= 1)
                    {
                        // upsert the updated document into the database
                        var upsertResult = await _bucket.UpsertAsync(ID, doc);
                        // if upsert fails return BadRequest (need to think of a different status code for this)
                        if (!upsertResult.Success)
                            return NotFound();
                    }
                    else
                    {
                        var del = await DeleteDoc();
                        Console.WriteLine(del.ToString());
                    }

                    // return 200 OK if everything works
                    return Ok();
                }
                else
                    return NotFound(new BadRequestError($"Document does not contain an offering with {offeringId}"));
            }
            else
                return NotFound(offeringId);
        }
    }
}
