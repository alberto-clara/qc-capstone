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
        public IActionResult Index() {

            return Ok(_catalogContext.products.ToArray());
        }

        // GET api/products/{id}
        [HttpGet]
        [Route("{id}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(Products), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<Products>> ItemByIdAsync(string id) {

            if (id == null) return BadRequest();

            var item = await _catalogContext.products.SingleOrDefaultAsync(a => a.Id == id);

            if (item != null) return Ok(item);

            return NotFound();
        }

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

            Console.Write("priceSort = ");
            Console.WriteLine(priceSort);
            /*
                        if (priceSort == "ascending")
                        {
                            newT.OrderBy(p => p.Unit_retail);
                            Console.WriteLine(newT);
                        }


                        else if (priceSort == "descending") newT.OrderByDescending(p => p.Unit_retail);


                        else newT.OrderBy(p => p.Product_name);*/

            var itemsOnPage = await newT
                                   .GroupBy(p => p.Product_name)
                                   .Select(g => g.First())
                                   .Skip(pageSize * pageIndex)
                                   .Take(pageSize)
                                   .ToListAsync();

            if (priceSort == "ascending") itemsOnPage = itemsOnPage.OrderBy(p => p.Unit_retail).ToList();

            else if (priceSort == "descending") itemsOnPage = itemsOnPage.OrderByDescending(p => p.Unit_retail).ToList();

            var model = new PaginatedItemsViewModel<PageView>(
                    pageIndex, pageSize, totalItems, itemsOnPage);

            return Ok(model);
            }

        // GET api/products/offerings/{productId}
        [HttpGet, Route("offerings/{offeringId}")]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> OfferingsByIdAsync(string productId) {

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
    }
}
