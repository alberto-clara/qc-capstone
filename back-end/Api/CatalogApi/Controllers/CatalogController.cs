using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CatalogApi.Infrastructure;
using CatalogApi.Model;
using CatalogApi.ViewModel;
using System.Net;

namespace CatalogApi.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class CatalogController : ControllerBase
    {
        private CatalogContext _catalogContext;

        public CatalogController(CatalogContext context)
        {
            _catalogContext = context;
        }

        // GET api/products
        [HttpGet]
        public IActionResult Index()
        {

            return Ok(_catalogContext.products.ToArray());
        }

        // GET api/products/{id}
        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Products), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<Products>> ItemByIdAsync(string id)
        {

            if (id == null) return BadRequest();

            var item = await _catalogContext.products.SingleOrDefaultAsync(a => a.Id == id);

            if (item != null) return Ok(item);

            return NotFound();
        }

        
        /*
         * {priceSort?} is an option route parameter, use ascending or descending to sort in the
         * needed way and if no sorting is needed this parameter can be omitted from the route
         * and it will be sorted based on the results will be sorted based on the product name.
         */ 
        // GET api/products/page/priceSort[?pageSize=3&pageIndex=10]
        [HttpGet, Route("page/{priceSort?}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(PaginatedItemsViewModel<PageView>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Items(string priceSort, [FromQuery]int pageSize = 10,
                                               [FromQuery]int pageIndex = 0)
        {
            if (pageSize == 0) return BadRequest();

            var totalItems = await _catalogContext.products.LongCountAsync();
            var newT = (from pt in _catalogContext.products
                        join ot in _catalogContext.offerings on pt.Id equals ot.Product_key
                        into newTable
                        from rt in newTable.DefaultIfEmpty()
                        orderby pt.Product_name
                        select new PageView
                        {
                            Id = pt.Id,
                            Product_name = pt.Product_name,
                            Unit_retail = Math.Round(newTable.Min(a => a.Unit_retail), 2)
                        });

            if (priceSort == "ascending") newT = newT.OrderBy(p => p.Unit_retail);

            else if (priceSort == "descending") newT = newT.OrderByDescending(p => p.Unit_retail);

            var itemsOnPage = await newT
                                   .GroupBy(p => p.Product_name)
                                   .Select(g => g.First())
                                   .Skip(pageSize * pageIndex)
                                   .Take(pageSize)
                                   .ToListAsync();

 //           if (priceSort == "ascending") itemsOnPage = itemsOnPage.OrderBy(p => p.Unit_retail).ToList();

 //           else if (priceSort == "descending") itemsOnPage = itemsOnPage.OrderByDescending(p => p.Unit_retail).ToList();

            var model = new PaginatedItemsViewModel<PageView>(
                    pageIndex, pageSize, totalItems, itemsOnPage);

            return Ok(model);
        }

        
        /*
         * This returns a list of all the offerings for a single product based on the product ID in the route. 
         * If information is needed about a specific offering of a product this route should not be used.
         */ 
        // GET api/products/offerings/{productId}
        [HttpGet, Route("offerings/{productId}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> OfferingsByIdAsync(string productId)
        {

            if (productId == null) return BadRequest();

            var newTable = (from pt in _catalogContext.products
                            join ot in _catalogContext.offerings on pt.Id equals ot.Product_key
                            join st in _catalogContext.suppliers on ot.Supplier_key equals st.Id
                            into temp
                            from rt2 in temp.DefaultIfEmpty()
                            where pt.Id == productId
                            select new
                            {
                                pt.Id,
                                pt.Long_description,
                                pt.Product_name,
                                Offering_key = ot.Id,
                                Unit_retail = Math.Round(ot.Unit_retail, 2),
                                Unit_cost = Math.Round(ot.Unit_cost, 2),
                                ot.Uom,
                                ot.Supplier_key,
                                rt2.supplier_name
                            });

            var items = await newTable
                                .OrderBy(p => p.Unit_retail)
                                .ToListAsync();

            if (items.Count != 0) return Ok(items);

            return NotFound();
        }

        
        /*
         * use this route if you want to get the information about a single offering of a product
         * the route needs to be passed the offering ID of what you want information about
         */
        // GET /api/products/offerings/single/{offeringId}
        [HttpGet, Route("offerings/single/{offeringId}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> SingleOfferingByIdAsync(string offeringId)
        {
            if (offeringId == null) return BadRequest();

            var result = await (from ot in _catalogContext.offerings
                                join pt in _catalogContext.products on ot.Product_key equals pt.Id
                                join st in _catalogContext.suppliers on ot.Supplier_key equals st.Id
                                into temp
                                from rt2 in temp.DefaultIfEmpty()
                                where ot.Id == offeringId
                                select new
                                {
                                    pt.Product_name,
                                    pt.Long_description,
                                    ot.Product_key,
                                    Offering_key = ot.Id,
                                    Unit_retail = Math.Round(ot.Unit_retail, 2),
                                    Unit_cost = Math.Round(ot.Unit_cost, 2),
                                    rt2.supplier_name
                                }).ToListAsync();

            Console.WriteLine(result.Count());

            if (result.Count() != 0) return Ok(result);

            return NotFound();
        }

        /*
         * Route for the homepage to grab ten randomly selected products 
         * from the database.
         */
        // GET /api/products/home
        [HttpGet, Route("home")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> RandomHomePageProducts(string offeringId)
        {

            Random rnd = new Random();
            var randomResults = await (from pt in _catalogContext.products
                                       orderby rnd.Next()
                                       select new
                                       {
                                           pt.Product_name,
                                           pt.Id,
                                           pt.Long_description
                                       })
                                       .Take(10)
                                       .ToListAsync();

            if (randomResults.Count > 0) return Ok(randomResults);

            return NotFound();
        }
    }
}
