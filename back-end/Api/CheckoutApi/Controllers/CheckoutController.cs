using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CheckoutApi.Models;
using System.Net.Http.Headers;
using Couchbase.Core;
using Couchbase;
using Couchbase.IO;
using Couchbase.N1QL;
using Couchbase.Extensions.DependencyInjection;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace CheckoutApi.Controllers
{
    [Authorize]
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
         * POSTMAN
         * GET /api/checkout/getOrderHistory
         * Route that will be user to retrieve a users order history in the
         * future. I haven't been able to test it yet. 
         *              NOTE TO SELF
         * will probably need to deserialize the JSON doc back to the 
         * checkout model before the response to the frontend is sent.
         */
        [HttpGet, Route("getOrderHistory")]
        public async Task<IActionResult> retrieveOrderHist()
        {
            var currentUser = HttpContext.User;

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return BadRequest();

            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;
            Console.WriteLine();
            Console.WriteLine($"ID = {ID}");
            Console.WriteLine();

            var result = await _checkoutBucket.GetAsync<Checkout>(ID);

            if (!result.Success)
                return NotFound();

            return Ok(result.Value);
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
//        [Authorize]
        [HttpPost, Route("addOrder")]
//        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
//        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> AddOrder([FromBody] Checkout checkoutDoc)
        {
            // check to make sure the Checkout model was bound correctly
            if (ModelState.IsValid)
            {
                var currentUser = HttpContext.User;
                if (!currentUser.HasClaim(c => c.Type == "user_id"))
                {
                    return BadRequest();
                }
                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;
                Console.WriteLine();
                Console.WriteLine($"ID = {ID}");
                Console.WriteLine();

                var userDoc = await _checkoutBucket.GetAsync<Checkout>(ID);

                if (!userDoc.Success)
                {
                    if (checkoutDoc.Orders[0].OrderId == null)
                    {
                        // set the OrderId with a new Guid
                        checkoutDoc.Orders[0].OrderId = Guid.NewGuid();
                        Console.WriteLine();
                        Console.WriteLine($"checkoutDoc.Orders[0].OrderId = {checkoutDoc.Orders[0].OrderId.ToString()}");
                        Console.WriteLine();
                    }
                    var result = await _checkoutBucket.InsertAsync(ID, checkoutDoc);

                    if (result.Success)
                        return Ok(checkoutDoc);
                    return Conflict();
                }
                else
                {
                    if (checkoutDoc.Orders[0].OrderId == null)
                    {
                        // set the OrderId with a new Guid
                        checkoutDoc.Orders[0].OrderId = Guid.NewGuid();
                        Console.WriteLine();
                        Console.WriteLine($"checkoutDoc.Orders[0].OrderId = {checkoutDoc.Orders[0].OrderId.ToString()}");
                        Console.WriteLine();
                        Checkout doc = userDoc.Value;
                        Console.WriteLine();
                        Console.WriteLine($"checkoutDoc.Orders.Count() = {checkoutDoc.Orders.Count().ToString()}");
                        Console.WriteLine();
                        doc.Orders.Add(checkoutDoc.Orders[0]);
                        Console.WriteLine();
                        Console.WriteLine($"checkoutDoc.Orders.Count() = {checkoutDoc.Orders.Count().ToString()}");
                        Console.WriteLine();

                        var result = await _checkoutBucket.UpsertAsync(ID, doc);

                        if (!result.Success)
                            return BadRequest();

                        return BadRequest();
                    }
                }
            }
            return BadRequest();
        }

        /*
         * Route to add a new users info to the database for the first time.
         * POST /api/checkout/addUserInfo
         * also not entirely finished yet. I need to check if a doc for the user exists first
         * if one does not then set the Id and content of the new doc then add it to the DB.
         */
        [HttpPost, Route("addUserInfo")]
        public async Task<IActionResult> AddUserInfo([FromBody] UserInfo newUserInfo)
        {
            Console.WriteLine("WE GOT HERE");
            if (ModelState.IsValid)
            {
                var currentUser = HttpContext.User;

                if (!currentUser.HasClaim(c => c.Type == "user_id"))
                    return BadRequest();

                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;
                var result = await _userInfoBucket.UpsertAsync(ID, newUserInfo);

//                Console.WriteLine($"newUserInfo = {newUserInfo.}");

                if (!result.Success)
                    return BadRequest();

                return Ok(newUserInfo);
            }
            else
                return BadRequest();
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
         /*
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
        */

        /* WORKING!!!!!
         * Should be finished and working correctly
         * Route to get user info and send it to the frontend
         * GET /api/catalog/getUserInfo
         */
        [HttpGet, Route("getUserInfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            var currentUser = HttpContext.User;
            if (!currentUser.HasClaim(c => c.Type == "user_id"))
            {
                return BadRequest();
            }
            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;
            var result = await _userInfoBucket.GetAsync<UserInfo>(ID);

            if (!result.Success)
                return NotFound();

            return Ok(result.Value);
        }
    }
}
