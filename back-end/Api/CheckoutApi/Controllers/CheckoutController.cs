using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CheckoutApi.Models;
using System.Net;
using Couchbase.Core;
using Couchbase;
using Couchbase.N1QL;
using Couchbase.Extensions.DependencyInjection;

namespace CheckoutApi.Controllers
{
    [Route("api/checkout")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        
        private IBucket _checkoutBucket;
        private IBucket _userInfoBucket;

        public CheckoutController(IBucketProvider bucketProvider)
        {
            // singleton that is the DB bucket similar to MySQL
            _checkoutBucket = bucketProvider.GetBucket("Checkout");
            _userInfoBucket = bucketProvider.GetBucket("UserInfo");
        }

        /*
         * GET /api/checkout/getOrderHistory
         * Route that will be user to retrieve a users order history in the
         * future. I haven't been able to test it yet. 
         *              NOTE TO SELF
         * will probably need to deserialize the JSON doc back to the 
         * checkout model before the response to the frontend is sent.
         */
        [HttpGet, Route("/getOrderHistory")]
        public async Task<IActionResult> retrieveOrderHist()
        {
            var uid = Request.Headers["Authorization"].ToString();

            var queryRequest = new QueryRequest()
                .Statement("SELECT * FROM Checkout WHERE META().id = $uid")
                .AddNamedParameter("$uid", uid);

            var result = await _checkoutBucket.QueryAsync<dynamic>(queryRequest);

            if (!result.Success) return NotFound();

            else return Ok(result);
        }

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
            }
            else return BadRequest();

            /*
            var doc = new Document<Checkout>
            {
                Id = uid,
                Content = checkoutDoc
            };
            */

            return Ok(checkoutDoc);
        }

        /*
         * Route to add a new users info to the database for the first time.
         * POST /api/checkout/addUserInfo
         * also not entirely finished yet. I need to check if a doc for the user exists first
         * if one does not then set the Id and content of the new doc then add it to the DB.
         */
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

        /*
         * Route to update a users information. Also not finished yet.
         * PUT /api/checkout/updateUserInfo
         * 
         *              NOTE TO SELF
         * Once it has been finished checking if the doc for the user exists or not
         * depending on what all the frontend is sending a new document may have to 
         * be created where the META().id of the new doc is set.
         */
        [HttpPut, Route("/updateUserInfo")]
        public async Task<IActionResult> UpdateUserInfo([FromBody] UserInfo userInfo)
        {
            var uid = Request.Headers["Authorization"].ToString();

            var queryRequest = new QueryRequest()
                .Statement("SELECT * FROM UserInfo WHERE META().id = $uid")
                .AddNamedParameter("$uid", uid);

            var result = await _userInfoBucket.QueryAsync<dynamic>(queryRequest);

            if (!result.Success) return NotFound();
            else return Ok();

        }
    }
}
