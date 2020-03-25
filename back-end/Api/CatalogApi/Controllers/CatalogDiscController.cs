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

        [HttpGet, Route("page/{sort?}")]
        public async Task<IActionResult> ProductsWDisc(string sort, [FromQuery]int pageSize = 10,
                                               [FromQuery]int pageIndex = 0)
        {
            var pageView = await _catalogQueries.GetProducts(sort, pageSize, pageIndex);
            
            foreach (PageView page in pageView.Data)
            {
                var queryRequest = new QueryRequest()
                    .Statement("select * from Discounts where product_key = $id")
                    .AddNamedParameter("$id", page.Id);
                var result = await _discounts.QueryAsync<Discounts>(queryRequest);

                if (result.Success)
                {
                    page.NumProductDiscounts = result.ToList().Count();
                }

                var queryRequest2 = new QueryRequest()
                    .Statement("select id, offering_keys, tiers, product_key, supplier_key, type from Discounts where any k in offering_keys satisfies k = $id end")
                    .AddNamedParameter("$id", page.Offering_key);
                var result2 = await _discounts.QueryAsync<Discounts>(queryRequest2);
                if (result2.Success)
                {
                    foreach (Discounts discounts in result2)
                    {
                        if (discounts.Offering_keys.Contains(page.Offering_key))
                        {
                            if (discounts.Type == "PRODUCT_DISCOUNT")
                            {
                                page.Discount_price = (page.Unit_retail * (1 - discounts.tiers[0].DiscountPercentage));
                            }
                            else if (discounts.Type == "SUPPLIER_DISCOUNT")
                            {
                                int index = discounts.Offering_keys.IndexOf(page.Offering_key, 0);
                                page.Discount_price = (page.Unit_retail * (1 - discounts.tiers[index].DiscountPercentage));
                            }
                        }
                    }
                }
            }           

            return Ok(pageView);
        }

        [HttpGet, Route("offerings/{productId}")]
        public async Task<IActionResult> OfferingsDisc(string productID)
        {
            if (productID == null)
                return BadRequest();

            var offerings = await _catalogQueries.GetOfferings(productID);

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
 //                           offerings[ii].tiers = discounts.tiers;
                            offerings[ii].Discount_percentage = Math.Round((discounts.tiers[0].DiscountPercentage * 100), 2).ToString();
                            offerings[ii].Discount_price = Math.Round(Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - discounts.tiers[0].DiscountPercentage), 2).ToString();
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
                            offerings[ii].Discount_percentage = Math.Round((discounts.tiers[index].DiscountPercentage * 100), 2).ToString();
                            offerings[ii].Discount_price = Math.Round(Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - discounts.tiers[0].DiscountPercentage), 2).ToString();
                            break;
                        }
                    }
                }
            }

            return Ok(offerings);
        }
        
        [HttpGet, Route("singleOffering/{offeringID}")]
        public async Task<IActionResult> SingleOfferingDisc(string offeringID)
        {
            if (offeringID == null)
                return BadRequest();

            var offering = await _catalogQueries.GetSingleOffering(offeringID);

            if (offering.Count() == 0)
                return NotFound();

            var queryRequest = new QueryRequest()
                    .Statement("select id, offering_keys, tiers, product_key, supplier_key, type from Discounts where any k in offering_keys satisfies k = $id end")
                    .AddNamedParameter("$id", offering[0].Offering_key);
            var result = _discounts.Query<Discounts>(queryRequest);

            if (result.Success)
            {
                foreach (Discounts discounts in result)
                {
                    if (discounts.Offering_keys.Contains(offering[0].Offering_key))
                    {
                        offering[0].Discount_key = discounts.Id;
                        offering[0].Type = discounts.Type;
                        Console.WriteLine($"offering[{0}].Type = {offering[0].Type}");
                        if (discounts.Type == "PRODUCT_DISCOUNT")
                        {
                            //                            offering[0].tiers = discounts.tiers;
                            offering[0].MaxQty = discounts.tiers[0].MaxQty;
                            offering[0].Discount_price = Math.Round(Convert.ToDecimal(offering[0].Unit_retail) * (1 - discounts.tiers[0].DiscountPercentage), 2).ToString();
                            offering[0].Discount_percentage = Math.Round((discounts.tiers[0].DiscountPercentage * 100), 2).ToString();
                        }
                        else if (discounts.Type == "SUPPLIER_DISCOUNT")
                        {
                            int index = discounts.Offering_keys.IndexOf(offering[0].Offering_key, 0);
                            //                            offering[0].tiers = new List<ViewModel.Tiers>();
                            //                            offering[0].tiers.Add(discounts.tiers[index]);
                            offering[0].MaxQty = discounts.tiers[index].MaxQty;
                            offering[0].Discount_percentage = Math.Round((discounts.tiers[index].DiscountPercentage * 100), 2).ToString();
                            offering[0].Discount_price = Math.Round(Convert.ToDecimal(offering[0].Unit_retail) * (1 - discounts.tiers[0].DiscountPercentage), 2).ToString();
                        }
                    }
                }

                return 
                    Ok(offering[0]);
            }
            else
                return Ok(offering[0]);            
        }
        
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

        [HttpGet, Route("getDiscount/{discountID}")]
        [ProducesResponseType((int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDiscount(string discountID)
        {
            Console.WriteLine($"discountID = {discountID}");
            if (discountID == null)
                return BadRequest();

            string statement = $"SELECT tiers FROM Discounts where id = '{discountID}'";

            var query = new QueryRequest()
                .Statement(statement);

            var request = await _discounts.QueryAsync<dynamic>(query);

            List<Model.Tiers> tiers = new List<Model.Tiers>();

            foreach (var t in request)
            {
                tiers = JsonConvert.DeserializeObject<List<Model.Tiers>>(t.tiers.ToString());
            }

            return Ok(tiers);
        }

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
          //                  offerings[ii].Discount_percentage = Math.Round((discounts.tiers[0].DiscountPercentage * 100), 2).ToString();
                            offerings[ii].Discount_price = Math.Round(Convert.ToDecimal(offerings[ii].Unit_retail) * ((100 - discounts.tiers[0].DiscountPercentage) / 100), 2).ToString();
                            break;
                        }
                        else if (discounts.Type == "BULK_DISCOUNT")
                        {
                            break;
                        }
                        else if (discounts.Type == "SUPPLIER_DSICOUNT")
                        {
                            int index = discounts.Offering_keys.IndexOf(offerings[ii].Offering_key, 0);
                            offerings[ii].Discount_percentage = Math.Round((discounts.tiers[index].DiscountPercentage * 100), 2).ToString();
                            offerings[ii].Discount_price = Math.Round(Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - discounts.tiers[0].DiscountPercentage), 2).ToString();
                            break;
                        }
                    }
                }
            }

            return Ok(offerings);
        }
    }
}
