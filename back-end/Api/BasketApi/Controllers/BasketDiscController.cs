using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Couchbase.Core;
using Couchbase.Extensions.DependencyInjection;
using Couchbase.IO;
using Couchbase.Views;
using BasketApi.Model;
using Microsoft.AspNetCore.Authorization;
using BasketApi.BasketApiErrors;
using System.Net.Http;
using System.Net.Http.Headers;
using BasketApi.ViewModel;
using Newtonsoft.Json;

namespace BasketApi.Controllers
{
    [Authorize]
    [Route("api/basketDisc")]
    public class BasketDiscController : Controller
    {
        private IBucket _bucket;

        public BasketDiscController(IBucketProvider bucketProvider)
        {
            // singleton that is the DB bucket similar to MySQL
            _bucket = bucketProvider.GetBucket("Basket");
        }

        /*
         * This route does the same thing as the non discounts route to add an item to the shopping but it does
         * so in a different way. To avoid problems with poor data validation vulnerabilities instead of
         * accepting all of the information from the frontend this implementation instead uses interprocess communication
         * POST (BasketAPI) - http://localhost:7003/api/basketDisc/add/{offeringID}
         * POST (through APIGateway) - http://localhost:7000/basket-api/basketDisc/add/{offeringID}
         */
        [HttpPost, Route("add/{offeringID}")]
        public async Task<IActionResult> AddToBasket(string offeringID, [FromHeader] string authorization, [FromQuery] int qty = 0)
        {
            // make sure an offering_key was sent - can't do anything without it
            if (offeringID == null)
                return BadRequest(new BadRequestError("no offering_key sent."));

            // make sure the quantity is greater than zero
            if (qty <= 0)
                return BadRequest(new BadRequestError("Quantity is zero"));

            // get the user_id
            var ID = GetID();

            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

            // attempt to retreive the users Basket document
            var doc = await _bucket.GetAsync<BasketDisc>(ID);
            int newOffering = 0;
            BasketDisc userDoc = null;

            // check to see if a document was retreived, need to create a new one if it wasn't
            if (doc.Success)
            {
                userDoc = doc.Value;

                // documents are persistent once they have been created so update the doc with the new time if total_items is zero
                if (userDoc.total_items == 0)
                    userDoc.Date = DateTimeOffset.Now.ToUnixTimeSeconds();

                // check to see if the offeringID sent in the route is already in the OfferingsDisc array
                if (userDoc.OfferingsDisc.Exists(i => i.Offering_key == offeringID))
                {
                    OfferingsDisc offer = userDoc.OfferingsDisc.Find(i => i.Offering_key == offeringID);

                    // find the index of where the element with offeringID is located in the array
                    var index = userDoc.OfferingsDisc.IndexOf(offer, 0);

                    // update all the information about the offering in the basket
                    userDoc.OfferingsDisc[index].Quantity += qty;
                    userDoc.total_cost = (Convert.ToDecimal(userDoc.total_cost) - Convert.ToDecimal(offer.totalOfferingCost)).ToString();
                    userDoc.OfferingsDisc[index] = CalcOfferingCost(userDoc.OfferingsDisc[index]);
                    userDoc.total_cost = (Convert.ToDecimal(userDoc.total_cost) + Convert.ToDecimal(offer.totalOfferingCost)).ToString();
                }
                else // if the offeringID isn't in the array set the newOffering flag (used later)
                    newOffering = 1;
            }
            // if there isn't already a Basket document for the user or the newOffering flag is set
            if (!doc.Success || newOffering == 1)
            {
                // split the authorization header string to remove 'Bearer' and isolate the JWT token
                string[] auth = authorization.Split(' ');
                // use the GetOffering() function to send the HTTP request to the CatalogApi to get the information about the offering being added
                HttpResponseMessage httpResponse = await GetOffering(auth[1], "http://localhost:7000/catalog-api/products/disc/singleOffering/" + offeringID);
                
                // make sure the HTTP response from the CatalogApi was successful
                if (!httpResponse.IsSuccessStatusCode)
                    return BadRequest(new BadRequestError(httpResponse.StatusCode.ToString() + " HttpRequest Failed."));

                // read the response as a type OfferingsDisc (what we will be adding to the Basket document)
                OfferingsDisc offering = await httpResponse.Content.ReadAsAsync<OfferingsDisc>();
                offering.Quantity = qty;
                BasketDisc basket = null;

                // check to see if the discount type is a BULK_DISCOUNT, need to use interproces communication again to get the tiers information about it
                if (offering.Type != "BULK_DISCOUNT")                
                    offering = CalcOfferingCost(offering);
                else if (offering.Type == "BULK_DISCOUNT")
                {
                    // get the BULK_DISCOUNT tiers information
                    httpResponse = await GetOffering(auth[1], "http://localhost:7000/catalog-api/products/disc/getDiscount/" + offering.Discount_key);

                    if (!httpResponse.IsSuccessStatusCode)
                        return BadRequest(new BadRequestError(httpResponse.StatusCode.ToString() + " HttpRequest Failed."));

                    // use the tiers information to correctly calculate the cost of the offering being added
                    offering.Tiers = new List<Tiers>();
                    offering.Tiers = await httpResponse.Content.ReadAsAsync<List<Tiers>>();
                    offering = CalcOfferingCost(offering);                    
                }

                // if newOffering is 0 update all the information and insert the Basket document
                if (newOffering == 0)
                {
                    basket = new BasketDisc();
                    basket.Uid = Guid.NewGuid();
                    basket.Date = DateTimeOffset.Now.ToUnixTimeSeconds();
                    basket.total_items = 1;
                    basket.OfferingsDisc = new List<OfferingsDisc>();
                    basket.OfferingsDisc.Add(offering);
                    basket.total_cost = offering.totalOfferingCost;

                    var res = await _bucket.UpsertAsync(ID, basket);

                    if (!res.Success)
                        return BadRequest(new BadRequestError("Failed to add document to database - new basket"));

                    return Ok(basket);
                }

                userDoc.total_cost = (Convert.ToDecimal(userDoc.total_cost) + Convert.ToDecimal(offering.totalOfferingCost)).ToString();
                userDoc.OfferingsDisc = userDoc.OfferingsDisc.Prepend(offering).ToList();
                userDoc.total_items += 1;
            }

            // insert the Basket document
            var result = await _bucket.UpsertAsync(ID, userDoc);

            if (!result.Success)
                return BadRequest(new BadRequestError("Failed to add userDoc to database"));

            // reutrn 200 OK, we don't need to return userDoc this was for testing
            return Ok(userDoc);
        }

        /*
         * Exactly the same as the non discount route in the BasketController
         * GET (BasketAPI) - http://localhost:7003/api/basketDisc/find
         * GET (through APIGateway) - http://localhost:7000/basket-api/basketDisc/find
         */
        [HttpGet, Route("find")]
        public async Task<IActionResult> FindBasket()
        {
            var ID = GetID();

            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

            var doc = await _bucket.GetAsync<BasketView>(ID);

            if (!doc.Success)
            {
                if (doc.Status == ResponseStatus.KeyNotFound)
                    return NotFound(new NotFoundError($"No document exists for {ID}"));
                else
                    return NotFound(doc);
            }

            return Ok(doc.Value);
        }

        /*
         * Works the same as the non discount route in the BasketController except there is more happening
         * because discounts need to be accounted for. Also to not retreive the entire Basket document
         * I experimented with using Couchbase subdocument queries through a view.
         * PUT (BasketAPI) - http://localhost:7003/api/basketDisc/update/{offeringID}/{qty}
         * PUT (through APIGateway) - http://localhost:7000/basket-api/basketDisc/update/{offeringID}/{qty}
         */
        [HttpPut, Route("update/{offeringID}/{qty}")]
        public async Task<IActionResult> UpdateQuant(string offeringID, int qty = 0)
        {
            var ID = GetID();

            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

            if (qty < 0)
                return BadRequest(new BadRequestError("Invalid quantity."));

            var query = new ViewQuery().From("dev_BasketDisc", "by_id").Key(new List<string> { ID, offeringID });
            var res = await _bucket.QueryAsync<dynamic>(query);

            if (!res.Success || res.Rows.Count() == 0)
                return NotFound(res.Message);

            var info = res.Rows.ToList().First().Value;
            int index = info[0];
            OfferingsDisc offering = JsonConvert.DeserializeObject<OfferingsDisc>(info[3].ToString());
            decimal total_cost = Convert.ToDecimal(info[1]) - Convert.ToDecimal(offering.totalOfferingCost);

            if (qty == 0)
            {
                var response = await _bucket.MutateIn<BasketDisc>(ID)
                    .Upsert("total_cost", total_cost.ToString())
                    .Upsert("total_items", info[2] - 1)
                    .Remove($"offeringsDisc[{index}]")
                    .ExecuteAsync();

                if (!response.Success)
                    return NotFound(new NotFoundError(response.Message));

                return Ok(response);
            }

            offering.Quantity = qty;
            offering = CalcOfferingCost(offering);
            total_cost += Convert.ToDecimal(offering.totalOfferingCost);

            var update_res = await _bucket.MutateIn<BasketDisc>(ID)
                .Upsert("total_cost", total_cost.ToString())
                .Replace($"offeringsDisc[{index}]", offering)
                .ExecuteAsync();

            if (!update_res.Success)
                return NotFound(new NotFoundError(update_res.Message));

            return Ok(update_res);
        }

        [HttpDelete, Route("delete")]
        public async Task<IActionResult> EmptyDoc()
        {
            var ID = GetID();

            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

            var doc = await _bucket.GetAsync<BasketDisc>(ID);

            if (!doc.Success)
            {
                if (doc.Status == ResponseStatus.KeyNotFound)
                    return NotFound(new NotFoundError($"No document exists for {ID}"));
                else
                    return NotFound();
            }

            doc.Value.OfferingsDisc.RemoveRange(0, doc.Value.total_items);
            doc.Value.total_items = 0;
            doc.Value.total_cost = "0";

            // replace the document in the database with the updated version
            var result = await _bucket.ReplaceAsync(ID, doc.Value);

            // check if the replacement was done successfully or not
            if (!result.Success)
                return NotFound(new NotFoundError($"Unable to replace document for {ID}"));

            return Ok(doc.Value);
        }

        private async Task<HttpResponseMessage> GetOffering(string auth, string path)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(path);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage httpResponse = await client.GetAsync(client.BaseAddress);

            if (!httpResponse.IsSuccessStatusCode)
                return null;

            return httpResponse;
        }

        private OfferingsDisc CalcOfferingCost(OfferingsDisc offer)
        {
            if (offer.Type == null)
                offer.totalOfferingCost = (Math.Round(Convert.ToDecimal(offer.unit_retail) * offer.Quantity, 2)).ToString();
            else if (offer.Type != "BULK_DISCOUNT")
            {
                if (offer.Quantity < offer.MaxQty)
                    offer.totalOfferingCost = (Math.Round(Convert.ToDecimal(offer.discount_price) * offer.Quantity, 2)).ToString();
                else
                    offer.totalOfferingCost = (Math.Round(Convert.ToDecimal(offer.unit_retail) * offer.Quantity, 2)).ToString();
            }
            else if (offer.Type == "BULK_DISCOUNT")
            {
                Console.WriteLine("offer.type = BULK_DSCOUNT");
                for (int ii = offer.Tiers.Count() - 1; ii >= 0; ii--)
                {
                    Console.WriteLine($"offer.tiers.Count() - 1 = {offer.Tiers.Count() - 1}");
                    if (offer.Quantity <= offer.Tiers[ii].MaxQty && offer.Quantity >= offer.Tiers[ii].MinQty)
                    {
                        Console.WriteLine("offer.Quantity <= offer.Tiers[ii].MaxQty && offer.Quantity >= offer.Tiers[ii].MinQty");
                        offer.discount_price = (Math.Round(Convert.ToDecimal(offer.unit_retail) * (1 - (offer.Tiers[ii].DiscountPercentage / 100)), 2)).ToString();
                        offer.totalOfferingCost = (Math.Round(Convert.ToDecimal(offer.discount_price) * offer.Quantity, 2)).ToString();
                        break;
                    }
                    else if (offer.Quantity >= offer.Tiers[ii].MaxQty && ii == 0)
                    {
                        offer.discount_price = null;
                        offer.totalOfferingCost = (Math.Round(Convert.ToDecimal(offer.unit_retail) * offer.Quantity, 2)).ToString();
                    }
                }
                if (offer.discount_price == null)
                {
                    offer.totalOfferingCost = (Math.Round(Convert.ToDecimal(offer.unit_retail) * offer.Quantity, 2)).ToString();
                }
            }

            return offer;
        }

        private string GetID()
        {
            var currentUser = HttpContext.User;

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return null;

            return currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;
        }
    }
}
