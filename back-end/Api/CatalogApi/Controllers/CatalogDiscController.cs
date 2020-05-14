using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Couchbase.Extensions.DependencyInjection;
using Couchbase.Core;
using Couchbase.N1QL;
using CatalogApi.ViewModel;
using CatalogApi.Model;
using CatalogApi.Infrastructure.Services;
using System.Net;
using Newtonsoft.Json;

/*
 * This is a replacement for the original CatalogController that includes discount information.
 * It is using the same SQL database and tables as the original controller but it is also using 
 * a Couchbase bucket that holds all of the discount information. The way the discounts are currently
 * setup is that when an offering of a prodcut is needed the Couchbase database is also queried based
 * on the Offering_key. If a discount is found for that offering than the necessary information is added
 * to the model storing the original data from the SQL database.
 */
namespace CatalogApi.Controllers
{
    [Route("api/products/disc")]
    [ApiController]
    public class CatalogDiscController : Controller
    {
        private IBucket _discounts;
        private readonly ICatalogQueries _catalogQueries;

        public CatalogDiscController(IBucketProvider bucketProvider, ICatalogQueries catalogQueries)
        {
            // singleton that is the DB bucket similar to MySQL
            _discounts = bucketProvider.GetBucket("Discounts");
            _catalogQueries = catalogQueries ?? throw new ArgumentNullException(nameof(catalogQueries));
        }

        /*
         * This is a replacement for the page/{sort?} in the CatalogController.
         * GET (CatalogApi) http://localhost:7001/api/products/disc/page/{sort?}
         * GET (APIGateway) http://localhost:7000/catalog-api/products/disc/page/{sort?}
         */
        [HttpGet, Route("page/{sort?}")]
        public async Task<IActionResult> ProductsWDisc(string sort, [FromQuery]int pageSize = 10,
                                               [FromQuery]int pageIndex = 0)
        {
            // use the GetProducts function in the CatalogQueries interface to get the paginated products
            var pageView = await _catalogQueries.GetProducts(sort, pageSize, pageIndex);
            
            // iterate through each of the PageView objects
            foreach (PageView page in pageView.Data)
            {
                // build a new Couchbase query where we are looking for Discounts based on the product_key
                var queryRequest = new QueryRequest()
                    .Statement("select * from Discounts where product_key = $id")
                    .AddNamedParameter("$id", page.Id);
                var result = await _discounts.QueryAsync<Discounts>(queryRequest);

                // make sure the query was successful
                if (result.Success)
                {
                    page.NumProductDiscounts = result.ToList().Count();
                }

                // build another Couchbase query where we lookup information based on the offering_key
                var queryRequest2 = new QueryRequest()
                    .Statement("select id, offering_keys, tiers, product_key, supplier_key, type from Discounts where any k in offering_keys satisfies k = $id end")
                    .AddNamedParameter("$id", page.Offering_key);
                var result2 = await _discounts.QueryAsync<Discounts>(queryRequest2);

                if (result2.Success)
                {
                    foreach (Discounts discounts in result2) // iterate through each of the Discounts from the returned query
                    {
                        // check to see if the result returned from the second Couchbase query containts the offering_key
                        if (discounts.Offering_keys.Contains(page.Offering_key))
                        {
                            if (discounts.Type == "PRODUCT_DISCOUNT")
                            {
                                page.Discount_price = Math.Round((page.Unit_retail * (1 - (discounts.tiers[0].DiscountPercentage / 100))), 2).ToString();
                            }
                            else if (discounts.Type == "SUPPLIER_DISCOUNT")
                            {
                                // get the index of the offering_key, needed for the correct Tier
                                int index = discounts.Offering_keys.IndexOf(page.Offering_key, 0);
                                page.Discount_price = Math.Round((page.Unit_retail * (1 - (discounts.tiers[0].DiscountPercentage / 100))), 2).ToString();
                            }
                        }
                    }
                }
            }           

            return Ok(pageView);
        }

        /*
         * This works the same as the route in CatalogController that gets all of the offerings for a single product
         * GET (CatalogApi) http://localhost:7001/api/products/disc/offerings/{productId}
         * GET (APIGateway) http://localhost:7000/catalog-api/products/disc/offerings/{productId}
         */
        [HttpGet, Route("offerings/{productId}")]
        public async Task<IActionResult> OfferingsDisc(string productID)
        {
            if (productID == null)
                return BadRequest();

            var offerings = await _catalogQueries.GetOfferings(productID);

            // build the Couchbase query string to get the discounts for each offering_key
            string statement = "select id, offering_keys, tiers, product_key, supplier_key, type from Discounts where any k in offering_keys satisfies";

            // we want to add all of the offering_keys to the query so we only need to do one instead of n individual queries
            for (int ii = 0; ii < offerings.Count(); ii++)
            {
                if (ii == 0)
                    statement += " k = '" + offerings[ii].Offering_key + "'";
                else 
                    statement += " or k = '" + offerings[ii].Offering_key + "'";
            }
            statement += " end";

            // add the query string as the QueryRequest statement
            var queryRequest = new QueryRequest()
                .Statement(statement);

            // send the query to the Couchbase Discounts bucket
            var result = _discounts.Query<Discounts>(queryRequest);

            // iterate all of the different offerings returned by the SQL query to add the discount info if it exists
            for (int ii = 0; ii < offerings.Count(); ii++)
            {
                foreach (Discounts discounts in result)
                {
                    if (discounts.Offering_keys.Contains(offerings[ii].Offering_key))
                    {
                        offerings[ii].Discount_key = discounts.Id;
                        offerings[ii].Type = discounts.Type;
                        if (discounts.Type == "PRODUCT_DISCOUNT")
                        {
 //                           offerings[ii].tiers = discounts.tiers;
                            offerings[ii].Discount_percentage = Math.Round((discounts.tiers[0].DiscountPercentage), 2).ToString();
                            offerings[ii].Discount_price = Math.Round(Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - (discounts.tiers[0].DiscountPercentage / 100)), 2).ToString();
                            break;
                        }
                        else if (discounts.Type == "BULK_DISCOUNT")
                        {
//                            offerings[ii].tiers = discounts.tiers;
                            break;
                        }
                        else if (discounts.Type == "SUPPLIER_DISCOUNT")
                        {
                            int index = discounts.Offering_keys.IndexOf(offerings[ii].Offering_key, 0);
//                            offerings[ii].tiers = new List<ViewModel.Tiers>();
//                            offerings[ii].tiers.Add(discounts.tiers[index]);
                            offerings[ii].Discount_percentage = Math.Round((discounts.tiers[index].DiscountPercentage), 2).ToString();
                            offerings[ii].Discount_price = Math.Round(Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - (discounts.tiers[0].DiscountPercentage / 100)), 2).ToString();
                            break;
                        }
                    }
                }
            }

            return Ok(offerings);
        }

        /*
         * Get information about a single offering
         * GET (CatalogApi) http://localhost:7001/api/products/disc/singleOffering/{offeringId}
         * GET (APIGateway) http://localhost:7000/catalog-api/products/disc/singleOfferings/{offeringId}
         */
        [HttpGet, Route("singleOffering/{offeringID}")]
        public async Task<IActionResult> SingleOfferingDisc(string offeringID)
        {
            if (offeringID == null)
                return BadRequest();

            var offering = await _catalogQueries.GetSingleOffering(offeringID);

            if (offering.Count() == 0)
                return NotFound();

            // build our query string where we add in the offering_key as a parameter
            var queryRequest = new QueryRequest()
                    .Statement("select id, offering_keys, tiers, product_key, supplier_key, type from Discounts where any k in offering_keys satisfies k = $id end")
                    .AddNamedParameter("$id", offering[0].Offering_key);
            var result = _discounts.Query<Discounts>(queryRequest);

            if (result.Success)
            {
                // foreach but only iterates once because there is only a single Discount returned
                foreach (Discounts discounts in result)
                {
                    if (discounts.Offering_keys.Contains(offering[0].Offering_key))
                    {
                        offering[0].Discount_key = discounts.Id;
                        offering[0].Type = discounts.Type;
                        Console.WriteLine($"offering[{0}].Type = {offering[0].Type}");
                        if (discounts.Type == "PRODUCT_DISCOUNT")
                        {
                            offering[0].MaxQty = discounts.tiers[0].MaxQty;
                            offering[0].Discount_price = Math.Round(Convert.ToDecimal(offering[0].Unit_retail) * (1 - (discounts.tiers[0].DiscountPercentage / 100)), 2).ToString();
                            offering[0].Discount_percentage = Math.Round((discounts.tiers[0].DiscountPercentage), 2).ToString();
                        }
                        else if (discounts.Type == "SUPPLIER_DISCOUNT")
                        {
                            int index = discounts.Offering_keys.IndexOf(offering[0].Offering_key, 0);
                            offering[0].MaxQty = discounts.tiers[index].MaxQty;
                            offering[0].Discount_percentage = Math.Round((discounts.tiers[index].DiscountPercentage), 2).ToString();
                            offering[0].Discount_price = Math.Round(Convert.ToDecimal(offering[0].Unit_retail) * (1 - (discounts.tiers[0].DiscountPercentage / 100)), 2).ToString();
                        }
                    }
                }

                return 
                    Ok(offering[0]);
            }
            else
                return Ok(offering[0]);            
        }

        /*
         * Don't believe we ended up using this but it enables retreiving Tiers info for multiple BULK_DISCOUNTs at once
         * GET (CatalogApi) http://localhost:7001/api/products/disc/getDiscounts
         * GET (APIGateway) http://localhost:7000/catalog-api/products/disc/getDiscounts
         */
        [HttpGet, Route("getDiscounts")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDiscounts([FromBody] List<string> discountList)
        {
            if (discountList.Count() == 0)
                return BadRequest();

            string statement = "SELECT tiers FROM Discounts where ";

            for (int ii = 0; ii < discountList.Count(); ii++)
            {
                if (ii == 0)
                    statement += " id = '" + discountList[0] + "'";
                else
                    statement += " or id = '" + discountList[ii] + "'";
            }

            statement += " and type  = 'BULK_DISCOUNT'";

            var query = new QueryRequest()
                .Statement(statement);

            var request = await _discounts.QueryAsync<dynamic>(query);

            List<List<Model.Tiers>> tiers = new List<List<Model.Tiers>>();

            foreach (var t in request)
            {
                tiers.Add(JsonConvert.DeserializeObject<List<Model.Tiers>>(t.tiers.ToString()));
            }

            return Ok(tiers);
        }

        /*
         * Used to get the discount info about a single BULK_DISCOUNT
         * GET (CatalogApi) http://localhost:7001/api/products/disc/getDiscount/{discountId}
         * GET (APIGateway) http://localhost:7000/catalog-api/products/disc/getDiscount/{discountId}
         */
        [HttpGet, Route("getDiscount/{discountID}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDiscount(string discountID)
        {
            if (discountID == null)
                return BadRequest();

            // build the Couchbase query string
            string statement = $"SELECT tiers FROM Discounts where id = '{discountID}'";

            var query = new QueryRequest()
                .Statement(statement);

            var request = await _discounts.QueryAsync<dynamic>(query);

            // initialize a new list of Tiers
            List<Model.Tiers> tiers = new List<Model.Tiers>();

            // iterate through all the results and deserialize the JSON object to the Tiers model
            foreach (var t in request)
            {
                tiers = JsonConvert.DeserializeObject<List<Model.Tiers>>(t.tiers.ToString());
            }

            return Ok(tiers);
        }

        /*
         * Used by the HomePage to get random offerings but with discounts applied to the price if they exist
         * GET (CatalogApi) http://localhost:7001/api/products/disc/homeDisc
         * GET (APIGateway) http://localhost:7000/catalog-api/products/disc/homeDisc
         */
        [HttpGet, Route("homeDisc")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetRandomOfferings()
        {
            var offerings = await _catalogQueries.RandomOfferings();

            if (offerings.Count() == 0)
                return NotFound();

            string statement = "select id, offering_keys, tiers, product_key, supplier_key, type from Discounts where any k in offering_keys satisfies";

            for (int ii = 0; ii < offerings.Count(); ii++)
            {
                if (ii == 0)
                    statement += " k = '" + offerings[ii].Offering_key + "'";
                else
                    statement += " or k = '" + offerings[ii].Offering_key + "'";
            }
            statement += " end";

            var queryRequest = new QueryRequest()
                .Statement(statement);

            var result = _discounts.Query<Discounts>(queryRequest);

            for (int ii = 0; ii < offerings.Count(); ii++)
            {
                foreach (Discounts discounts in result)
                {
                    if (discounts.Offering_keys.Contains(offerings[ii].Offering_key))
                    {
                        offerings[ii].Discount_key = discounts.Id;
                        offerings[ii].Type = discounts.Type;
                        if (discounts.Type == "PRODUCT_DISCOUNT")
                        {
                            offerings[ii].MaxQty = discounts.tiers[0].MaxQty;
                            offerings[ii].Discount_percentage = Math.Round((discounts.tiers[0].DiscountPercentage), 2).ToString();
                            offerings[ii].Discount_price = Math.Round(Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - (discounts.tiers[0].DiscountPercentage / 100)), 2).ToString();
                            break;
                        }
                        else if (discounts.Type == "BULK_DISCOUNT")
                        {
                            break;
                        }
                        else if (discounts.Type == "SUPPLIER_DISCOUNT")
                        {
                            int index = discounts.Offering_keys.IndexOf(offerings[ii].Offering_key, 0);
                            offerings[ii].MaxQty = discounts.tiers[index].MaxQty;
                            offerings[ii].Discount_percentage = Math.Round((discounts.tiers[index].DiscountPercentage), 2).ToString();
                            offerings[ii].Discount_price = Math.Round(Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - (discounts.tiers[index].DiscountPercentage / 100)), 2).ToString();
                            offerings[ii].MaxQty = discounts.tiers[index].MaxQty;
                            break;
                        }
                    }
                }
            }

            return Ok(offerings);
        }
    }
}
