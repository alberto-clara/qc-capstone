using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CheckoutApi.Models;
using System.Net;
using Couchbase.Core;
using Couchbase;
using Couchbase.Extensions.DependencyInjection;

namespace CheckoutApi.Controllers
{
    [Route("api/checkout")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        /*
        private IBucket _checkoutBucket;
        private IBucket _userInfoBucket;

        public CheckoutController(IBucketProvider bucketProvider)
        {
            // singleton that is the DB bucket similar to MySQL
            _checkoutBucket = bucketProvider.GetBucket("Checkout");
            _userInfoBucket = bucketProvider.GetBucket("UserInfo");
        }
        */

        /* 
         *                    ---- NOTE TO MYSELF ----
         * need to eventually first check to see if a Checkout doc for the
         * user exists. If a document does not exist set OrderId with a new
         * Guid and make a new doc while setting the Id of the doc. If a doc
         * for the user does exist, retrieve that document then need to set
         * the OrderId for the new order with a new Guid and add the new order
         * to the array of orders for the users doc retrieved from the DB.
         */ 
        [HttpPost, Route("/addOrder")]
//        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
//        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> AddOrder([FromBody] Checkout checkoutDoc)
        {
            //            var uid = Request.Headers["Authorization"].ToString();

            // check to make sure the Checkout model was bound correctly
            if (ModelState.IsValid)
            {
                // loop through the list of orders
                for (int ii = 0; ii < checkoutDoc.Orders.Count(); ii++)
                {
                    // the order where OrderId is null is the new one that needs updated
                    if (checkoutDoc.Orders[0].OrderId == null)
                    {
                        // set the OrderId with a new Guid
                        checkoutDoc.Orders[0].OrderId = Guid.NewGuid();
                    }
                }
                

//                return Ok(checkoutDoc);
            }
            else
            {
                return NotFound();
            }
            

            /*
            var doc = new Document<Checkout>
            {
                Id = uid,
                Content = checkoutDoc
            };
            */

            return Ok(checkoutDoc);

        }

       [HttpPost, Route("/addUserInfo")]
       public async Task<IActionResult> AddUserInfo([FromBody] UserInfo newUserInfo)
        {
            var uid = Request.Headers["Authorization"].ToString();

            var doc = new Document<UserInfo>
            {
                Id = uid,
                Content = newUserInfo
            };

            return Ok();
        }
    }
}
