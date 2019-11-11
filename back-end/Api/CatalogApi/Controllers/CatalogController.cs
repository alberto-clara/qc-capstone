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

        [HttpGet]
        public IActionResult Index()
        {
            return Ok(_catalogContext.products.ToArray());
        }

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
/*        public CatalogController(CatalogContext context)
        {
            _catalogContext = context ?? throw new ArgumentNullException(nameof(context));
        } */

        // GET api/currencies
//        [HttpGet, Route("")]
//        [ProducesResponseType(typeof(PaginatedItemsViewModel<CatalogProducts>), (int)HttpStatusCode.OK)]
/*        public async Task<IActionResult> Items([FromQuery]int pageSize = 10,
                                               [FromQuery]int pageIndex = 0)
        {
            var totalItems = await _catalogContext.CatalogProducts.LongCountAsync();
            var itemsOnPage = await _catalogContext.CatalogProducts
                .OrderBy(c => c.Product_name)
                .Skip(pageSize * pageIndex)
                .Take(pageSize)
                .ToListAsync();

 //           itemsOnPage = ChangeUriPlaceholder(itemsOnPage);

            var model = new PaginatedItemsViewModel<CatalogProducts>(
                    pageIndex, pageSize, totalItems, itemsOnPage);

            return Ok(model);
            } */
    }
}
