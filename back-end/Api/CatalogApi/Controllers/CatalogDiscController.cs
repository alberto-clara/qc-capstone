using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Couchbase.Extensions.DependencyInjection;
using Couchbase.Core;
using Couchbase.N1QL;
using CatalogApi.Infrastructure;
using CatalogApi.Model;
using CatalogApi.ViewModel;
using CatalogApi.Infrastructure.Services;
using Newtonsoft.Json;
using Couchbase.Linq;

namespace CatalogApi.Controllers
{
    [Route("api/products/disc")]
    [ApiController]
    public class CatalogDiscController : Controller
    {
        private IBucket _discounts;
//        private CatalogContext _catalogContext;
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

            /*
            var queryRequest = new QueryRequest()
                .Statement("select * from Discounts where product_key = $id")
                .AddNamedParameter("$id", prodID);
            var result = await _discounts.QueryAsync<dynamic>(queryRequest);
            */

            return Ok(pageView);
        }

        [HttpGet, Route("offerings/{productId}")]
        public async Task<IActionResult> OfferingsDisc(string productID)
        {
            var offerings = await _catalogQueries.GetOfferings(productID);

            for (int ii = 0; ii < offerings.Count(); ii++)
            {
                
                var queryRequest = new QueryRequest()
                    .Statement("select id, offering_keys, tiers, product_key, supplier_key, type from Discounts where any k in offering_keys satisfies k = $id end")
                    .AddNamedParameter("$id", offerings[ii].Offering_key);
                    
                var result = _discounts.Query<Discounts>(queryRequest);

                foreach (Discounts discounts in result)
                {
                    if (discounts.Offering_keys.Contains(offerings[ii].Offering_key))
                    {
                        offerings[ii].Discount_key = discounts.Id;
                        offerings[ii].Type = discounts.Type;
                        Console.WriteLine($"offerings[{ii}].Type = {offerings[ii].Type}");
                        if (discounts.Type == "PRODUCT_DISCOUNT")
                        {
                            offerings[ii].tiers = discounts.tiers;
                            offerings[ii].Discount_price = (Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - discounts.tiers[0].DiscountPercentage)).ToString();
                        }
                        else if (discounts.Type == "BULK_DISCOUNT")
                            offerings[ii].tiers = discounts.tiers;
                        else
                        {
                            int index = discounts.Offering_keys.IndexOf(offerings[ii].Offering_key, 0);
                            Console.WriteLine($"index = {index}");
                            offerings[ii].tiers = new List<ViewModel.Tiers>();
                            offerings[ii].tiers.Add(discounts.tiers[index]);
                            offerings[ii].Discount_price = (Convert.ToDecimal(offerings[ii].Unit_retail) * (1 - discounts.tiers[0].DiscountPercentage)).ToString();
                        }
                    }
                }
            }

            return Ok(offerings);
        }

        [HttpGet, Route("singleOffering/{offeringID")]
        public async Task<IActionResult> SingleOfferingDisc(string offeringID)
        {
            if (offeringID == null) return BadRequest();

            var offering = await _catalogQueries.GetSingleOffering(offeringID);

            if (offering.Count() == 0)
                return NotFound();
        }
    }
}
