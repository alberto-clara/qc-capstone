using System;
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
         * POST (BasketAPI) - http://localhost:7003/api/basket/add
         * POST (through APIGateway) - http://localhost:7000/basket-api/basket/add
         */
        [HttpPost, Route("add")]
        public async Task<IActionResult> AddDoc([FromBody] Basket newBasketItem)
        {
            // check if the model binds correctly
            if (ModelState.IsValid)
            {
                // get the users ID from the HttpContext
                var ID = GetID();

                // The ID should never be NULL because they wouldn't have been authorized but checking anyways
                if (ID == null)
                    return BadRequest(new BadRequestError("user_id not found."));
               
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
                // get the users ID from the HttpContext
                var ID = GetID();

                // The ID should never be NULL because they wouldn't have been authorized but checking anyways
                if (ID == null)
                    return BadRequest(new BadRequestError("user_id not found."));

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
         * GET (BasketAPI) - http://localhost:7003/api/basket/find
         * GET (through APIGateway) - http://localhost:7000/basket-api/basket/find
         */
        [HttpGet, Route("find")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> LookupDoc()
         {
            // get the users ID from the HttpContext
            var ID = GetID();

            // The ID should never be NULL because they wouldn't have been authorized but checking anyways
            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

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
         * This is a route that the frontend wanted so they would not have to retrieve
         * the entire document when updating the number next to the basket icon. The
         * route only returns a single integer which is the total # of items in the users basket
         * GET (BasketAPI) - http://localhost:7003/api/basket/count
         * GET (through APIGateway) - http://localhost:7000/basket-api/basket/count
         */
        [HttpGet, Route("count")]
        public async Task<IActionResult> TotalItemBasket()
        {
            var ID = GetID();

            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

            var result = await _bucket.GetAsync<Basket>(ID);

            if (!result.Success)
            {
                if (result.Status == ResponseStatus.KeyNotFound)
                    return Ok(0);
                else
                    return NotFound();
            }

            return Ok(result.Value.total_items);
        }

        /*
         * Route to be used when a user finalizes a purchase or when they remove
         * the last item from the basket.
         * UPDATE - changed to keep the document persistent and solve the 404 NotFound
         * on frontend when trying to update basket item count. Not technically following
         * RESTful API standards and should be changed in the future
         * DELETE (BasketAPI) - http://localhost:7003/api/basket/delete
         * DELETE (through APIGateway) - http://localhost:7000/basket-api/basket/delete
         */
        [HttpDelete, Route("delete")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> DeleteDoc()
        {
            // get the users ID from the HttpContext
            var ID = GetID();

            // The ID should never be NULL because they wouldn't have been authorized but checking anyways
            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

            // Get the users Basket document from the Couchbase bucket if it exists
            var doc = await _bucket.GetAsync<Basket>(ID);

            // check if the document was successfully retrieved
            if (!doc.Success)
            {
                /*
                 * Check specifically for the case if the document could not be found
                 * for that user, this will happen if a document has not been created
                 * yet for the user.
                 */
                if (doc.Status == ResponseStatus.KeyNotFound)
                    return NotFound(new NotFoundError($"No document exists for {ID}"));
                else
                    return NotFound();
            }

            /*
             * To help solve the 404 responses on the frontend the document was made to be
             * persistent. Once a user checks out or removes all the items from their basket
             * the document will still exist, but the array of offering objects will be empty
             * and the total # of item and total cost of the basket is set to zero.
             */
            doc.Value.Offerings.RemoveRange(0, doc.Value.total_items);
            doc.Value.total_items = 0;            
            doc.Value.total_cost = 0;
            
            // replace the document in the database with the updated version
            var result = await _bucket.ReplaceAsync(ID, doc.Value);

            // check if the replacement was done successfully or not
            if (!result.Success)
                return NotFound(new NotFoundError($"Unable to replace document for {ID}"));

            return Ok(doc.Value);
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
            // get the users ID from the HttpContext
            var ID = GetID();

            // The ID should never be NULL because they wouldn't have been authorized but checking anyways
            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

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

        /*
         * This function gets the User_ID from the HttpContext. The information about the user
         * is stored in the HttpContext when the Firebase JWT token is decrypted by the JWT
         * middleware in the Startup.cs file.
         */
        private string GetID()
        {
            var currentUser = HttpContext.User;

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return null;

            return currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;
        }
    }
}
