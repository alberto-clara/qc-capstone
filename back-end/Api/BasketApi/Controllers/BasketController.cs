using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Couchbase;
using Couchbase.Core;
using Couchbase.Extensions.DependencyInjection;
using BasketApi.Model;
using System.Net;
using Couchbase.N1QL;
using Microsoft.AspNetCore.Authorization;

namespace UserInfoApi.Controllers
{
    [Route("api/basket")]
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
         * Route that adds a new document to the DB
         * goto
         */
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

        [HttpGet]
        [Route("/find/{uid}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> LookupDoc(Guid uid)
        {
            var queryRequest = new QueryRequest()
                .Statement("SELECT * FROM Basket WHERE uid = $uid")
                .AddNamedParameter("$uid", uid);

            var result = await _bucket.QueryAsync<dynamic>(queryRequest);

            if (!result.Success) return NotFound();

            return Ok(result);
        }

        [HttpDelete]
        [Route("/delete/{uid}")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> DeleteDoc(Guid uid)
        {
            var result = await _bucket.RemoveAsync(uid.ToString());

            if (!result.Success) return NotFound();

            return Ok();
        }

        [HttpPut]
        [Route("/update")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> UpdateDoc([FromBody] Basket updateItem)
        {
            var result = await _bucket.UpsertAsync(updateItem.Uid.ToString(), updateItem);

            if (!result.Success) return NotFound();

            return Ok();
        }
    }
}
