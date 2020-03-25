using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Couchbase.Core;
using Couchbase.Extensions.DependencyInjection;
using BasketApi.Model;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using BasketApi.BasketApiErrors;
using System.Net.Http;
using System.Net.Http.Headers;

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

        [HttpGet, Route("add/{offeringID}")]
        public async Task<IActionResult> AddToBasket(string offeringID, [FromHeader] string authorization, [FromQuery] int qty = 0)
        {
            if (offeringID == null)
                return BadRequest(new BadRequestError("no offering_key sent."));

            if (qty == 0)
                return BadRequest(new BadRequestError("Quantity is zero"));

            var ID = GetID();

            if (ID == null)
                return BadRequest(new BadRequestError("user_id not found."));

            var doc = await _bucket.GetAsync<BasketDisc>(ID);
            int newOffering = 0;
            BasketDisc userDoc = null;

            Console.WriteLine($"offering_key = {offeringID}");
            if (doc.Success)
            {
                userDoc = doc.Value;
                if (userDoc.OfferingsDisc.Exists(i => i.Offering_key == offeringID))
                {
                    OfferingsDisc offer = userDoc.OfferingsDisc.Find(i => i.Offering_key == offeringID);

                    var index = userDoc.OfferingsDisc.IndexOf(offer, 0);

                    userDoc.OfferingsDisc[index].Quantity += qty;
                    userDoc.total_cost = (Convert.ToDecimal(userDoc.total_cost) - Convert.ToDecimal(offer.totalOfferingCost)).ToString();
                    userDoc.OfferingsDisc[index] = CalcOfferingCost(userDoc.OfferingsDisc[index]);
                    userDoc.total_cost = (Convert.ToDecimal(userDoc.total_cost) + Convert.ToDecimal(offer.totalOfferingCost)).ToString();
                }
                else
                    newOffering = 1;
            }
            if (!doc.Success || newOffering == 1)
            {
                Console.WriteLine($"newOffering = {newOffering}");
                string[] auth = authorization.Split(' ');
                HttpResponseMessage httpResponse = await GetOffering(auth[1], "http://localhost:7000/catalog-api/products/disc/singleOffering/" + offeringID);
                if (!httpResponse.IsSuccessStatusCode)
                    return BadRequest(new BadRequestError(httpResponse.StatusCode.ToString() + " HttpRequest Failed."));
                OfferingsDisc offering = await httpResponse.Content.ReadAsAsync<OfferingsDisc>();
                offering.Quantity = qty;
                BasketDisc basket = null;

                if (offering.Type != "BULK_DISCOUNT")                
                    offering = CalcOfferingCost(offering);
                else if (offering.Type == "BULK_DISCOUNT")
                {
                    Console.WriteLine("BULK_DISCOUNT");
                    httpResponse = await GetOffering(auth[1], "http://localhost:7000/catalog-api/products/disc/getDiscount/" + offering.Discount_key);

                    if (!httpResponse.IsSuccessStatusCode)
                        return BadRequest(new BadRequestError(httpResponse.StatusCode.ToString() + " HttpRequest Failed."));

                    offering.Tiers = new List<Tiers>();
                    offering.Tiers = await httpResponse.Content.ReadAsAsync<List<Tiers>>();
                    offering = CalcOfferingCost(offering);                    
                }

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

            var result = await _bucket.UpsertAsync(ID, userDoc);

            if (!result.Success)
                return BadRequest(new BadRequestError("Failed to add userDoc to database"));

            return Ok(userDoc);
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
                for (int ii = offer.Tiers.Count() - 1; ii > 0; ii--)
                {
                    Console.WriteLine($"offer.tiers.Count() - 1 = {offer.Tiers.Count() - 1}");
                    if (offer.Quantity < offer.Tiers[ii].MaxQty && offer.Quantity > offer.Tiers[ii].MinQty)
                    {
                        offer.discount_price = (Math.Round(Convert.ToDecimal(offer.unit_retail) * (1 - offer.Tiers[ii].DiscountPercentage), 2)).ToString();
                        offer.totalOfferingCost = (Math.Round(Convert.ToDecimal(offer.discount_price) * offer.Quantity, 2)).ToString();
                    }
                }
                if (offer.totalOfferingCost == null)
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
