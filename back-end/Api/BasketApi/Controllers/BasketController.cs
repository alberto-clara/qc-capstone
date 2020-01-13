using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Couchbase;
using Couchbase.Core;
using Couchbase.Extensions.DependencyInjection;
using BasketApi.Model;

namespace UserInfoApi.Controllers
{
    [Route("api/basket")]
    [ApiController]
    public class BasketController : Controller
    {
        private IBucket _bucket;

        public BasketController(IBucketProvider bucketProvider)
        {
            _bucket = bucketProvider.GetBucket("basket");
        }

        [HttpPost]
        [Route("/add")]
        public async Task<IActionResult> AddDoc([FromBody] Basket newBasketItem)
        {
            if (!newBasketItem.Uid.HasValue)
                newBasketItem.Uid = Guid.NewGuid();

            var response = await _bucket.UpsertAsync(newBasketItem.Uid.ToString(), newBasketItem);

            if (!response.Success)
                return BadRequest(newBasketItem);

            return Ok(newBasketItem);
        }
    }
}
