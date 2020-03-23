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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using MimeKit;
using CheckoutApi.Services;

namespace CheckoutApi.Controllers
{
    [Authorize]
    [Route("api/checkout")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {        
        private IBucket _checkoutBucket;
        private IBucket _userInfoBucket;
        private IHostingEnvironment _env;
        private readonly IEmailSender _emailSender;

        public CheckoutController(IBucketProvider bucketProvider, IHostingEnvironment env, IEmailSender emailSender)
        {
            // singleton that is the DB bucket similar to MySQL
            _checkoutBucket = bucketProvider.GetBucket("Checkout");
            _userInfoBucket = bucketProvider.GetBucket("UserInfo");
            _env = env;
            _emailSender = emailSender;
        }
        
        /*
         * POSTMAN
         * GET /api/checkout/getOrderHistory
         * Route that will be user to retrieve a users order history in the
         * future. I haven't been able to test it yet. 
         */
        [HttpGet, Route("getOrderHistory")]
        public async Task<IActionResult> retrieveOrderHist()
        {
            var currentUser = HttpContext.User;

            if (!currentUser.HasClaim(c => c.Type == "user_id"))
                return BadRequest();

            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

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
*/

        [HttpPut, Route("add")]
        public async Task<IActionResult> add([FromHeader] string authorization)
        {           
            var currentUser = HttpContext.User;
            if (!currentUser.HasClaim(c => c.Type == "user_id"))
            {
                return BadRequest();
            }
            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;
            string[] auth = authorization.Split(' ');

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:7000/basket-api/basket/find");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth[1]);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage httpResponse = await client.GetAsync(client.BaseAddress);

            if (!httpResponse.IsSuccessStatusCode)
                return BadRequest(httpResponse.StatusCode);

            var userDoc = await _checkoutBucket.GetAsync<Checkout>(ID);

            var userInfoDoc = await _userInfoBucket.GetAsync<UserInfo>(ID);

            if (!userInfoDoc.Success)
                return BadRequest();

            Order order = await httpResponse.Content.ReadAsAsync<Order>();

            order.date = DateTime.Now;
            order.OrderId = Guid.NewGuid();
            order.Shipping = userInfoDoc.Value;
//            order.Shipping = new ShippingInfo();
//            order.Shipping = order.ShippingInfo();
            Checkout checkout = null;
            if (!userDoc.Success)
            {
                checkout = new Checkout();
                checkout.Orders = new List<Order>();
                checkout.Orders.Add(order);

                var result = await _checkoutBucket.UpsertAsync(ID, checkout);

                if (!result.Success)
                    return NotFound("!userDoc.Success");
            }
            else
            {
                checkout = userDoc.Value;
                checkout.Orders = checkout.Orders.Prepend(order).ToList();

                var res = await _checkoutBucket.UpsertAsync(ID, checkout);

                if (!res.Success)
                    return NotFound("!res.Success");
            }

            client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost:7000/basket-api/basket/delete");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth[1]);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpResponse = await client.DeleteAsync(client.BaseAddress);

            if (!httpResponse.IsSuccessStatusCode)
                return BadRequest(httpResponse.StatusCode);

            await SendEmail(ID, checkout.Orders[0]);

            return Ok(checkout);
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
            if (ModelState.IsValid)
            {
                var currentUser = HttpContext.User;

                if (!currentUser.HasClaim(c => c.Type == "user_id"))
                    return BadRequest();

                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

                if (newUserInfo.Uid == null)
                    newUserInfo.Uid = ID;
                var result = await _userInfoBucket.UpsertAsync(ID, newUserInfo);

                if (!result.Success)
                    return BadRequest();

                return Ok(newUserInfo);
            }
            else
                return BadRequest();
        }

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

        private async Task SendEmail(string ID, Order order)
        {
            if (ModelState.IsValid)
            {
                var fp = "Template"
                    + Path.DirectorySeparatorChar.ToString()
                    + "ConfirmOrder.html";

                var subject = "qc-capstone Order Confirmation";

                var builder = new BodyBuilder();
                using (StreamReader reader = System.IO.File.OpenText(fp))
                {
                    builder.HtmlBody = reader.ReadToEnd();
                }

                string orders = null;
                string name = order.Shipping.Full_name.First_name + " " + order.Shipping.Full_name.Last_name;
                foreach (Offerings offering in order.Offerings)
                {
                    orders += "<tr> < td style = 'padding: 20px 0 20px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;" +
                                                    "align = 'left' >" +
                                                    "< table width = '100%' cellspacing = '0' cellpadding = '0' border = '0' >" +   
                                                               "< tbody >" +
                                                                   "< tr >" +
                                                                       "< td >" +       
                                                                           "< img src = 'Email_Templatehtml_files/right.gif' alt = ''" +
                                                                        "style = 'display: block;' width = '' height = '100' >" +    
                                                                    "</ td >" +   
                                                                    "< td >" + offering.Product_name + "</ td >" +
                                                                       "< td style = 'padding: 0px 20px 0px 20px;' >" +
                                                                            offering.Quantity +
                                                                        "</ td >" +
                                                                        "< td > $" + offering.Unit_retail + "</ td >" +
                                                                      "</ tr >" +
                                                                  "</ tbody >" +
                                                              "</ table >" +
                                                          "</ td >" +
                                                      "</ tr >";
                }

                string messageBody = string.Format(builder.HtmlBody,
                    name,
                    order.OrderId,
                    orders
                    );

                await _emailSender.SendEmailAsync(order.Shipping.Email, subject, messageBody, name);
            }
        }
    }
}
