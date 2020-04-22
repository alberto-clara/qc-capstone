using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CheckoutApi.Models;
using System.Net.Http.Headers;
using Couchbase.Core;
using Couchbase.IO;
using Couchbase.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using MimeKit;
using CheckoutApi.Services;
using MimeKit.Utils;

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
        private Configuration configuration { get; set; }

        public CheckoutController(IBucketProvider bucketProvider, IHostingEnvironment env, IEmailSender emailSender, Configuration configuration)
        {
            // singleton that is the DB bucket similar to MySQL
            _checkoutBucket = bucketProvider.GetBucket("Checkout");
            _userInfoBucket = bucketProvider.GetBucket("UserInfo");
            _env = env;
            _emailSender = emailSender;
            this.configuration = configuration;
        }
        
        /*         
         * Route to retrieve a users order history.
         * GET (CheckoutApi) http://localhost:7004/api/checkout/getOrderHistory
         * GET (through APIGateway) http://localhost:7000/checkout-api/checkout/getOrderHistory
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
         * PUT (CheckoutApi) http://localhost:7004/api/checkout/add
         * PUT (through APIGateway) http://localhost:7000/checkout-api/checkout/add
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
            client.BaseAddress = new Uri($"{configuration.APIGATEWAYURL}/basket-api/basket/find");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth[1]);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            HttpResponseMessage httpResponse = await client.GetAsync(client.BaseAddress);

            if (!httpResponse.IsSuccessStatusCode)
                return BadRequest(httpResponse.StatusCode);

            var userDoc = await _checkoutBucket.GetAsync<Checkout>(ID);

            var userInfoDoc = await _userInfoBucket.GetAsync<UserInfo>(ID);

            if (!userInfoDoc.Success)
            {
                if (userInfoDoc.Status != ResponseStatus.KeyNotFound)
                    return NotFound(userInfoDoc.Message);
            }

            Order order = await httpResponse.Content.ReadAsAsync<Order>();

            order.date = DateTime.Now.ToLocalTime().ToString("MM/dd/yyyy HH:mm tt");
            order.OrderId = Guid.NewGuid();
            order.Shipping = userInfoDoc.Value;
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
            client.BaseAddress = new Uri($"{configuration.APIGATEWAYURL}/basket-api/basket/delete");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth[1]);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpResponse = await client.DeleteAsync(client.BaseAddress);

            if (!httpResponse.IsSuccessStatusCode)
                return BadRequest(httpResponse.StatusCode);

            if (userInfoDoc.Success)
            {
                SendEmail(ID, checkout.Orders[0]);
            }

            return Ok(checkout);
        }

        /*
         * Route to add a new users info to the database for the first time.
         * POST /api/checkout/addUserInfo
         * also not entirely finished yet. I need to check if a doc for the user exists first
         * if one does not then set the Id and content of the new doc then add it to the DB.
         * POST (CheckoutApi) http://localhost:7004/api/checkout/addUserInfo
         * POST (through APIGateway) http://localhost:7000/checkout-api/checkout/addUserInfo
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

        /* 
         * Should be finished and working correctly
         * Route to get user info and send it to the frontend
         * GET (CheckoutApi) http://localhost:7004/api/checkout/getUserInfo
         * GET (through APIGateway) http://localhost:7000/checkout-api/checkout/getUserInfo
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
                return NotFound(result.Message);

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
                var image = builder.LinkedResources.Add("Template/Email_Templatehtml_files/right.gif");
                image.ContentId = MimeUtils.GenerateMessageId();
                foreach (Offerings offering in order.Offerings)
                {
                    orders += $@"<tr>
                                     <td style=""padding: 20px 0 20px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;""
                                        align = ""left"">
                                        <table width = ""100%"" cellspacing = ""0"" cellpadding = ""0"" border = ""0"">      
                                            <tbody>       
                                                <tr>
                                                    <td>
                                                    <img src=""cid:{image.ContentId}""
                                                        style = ""display: block;"" width = """" height = ""100"">    
                                                    </td>    
                                                    <td> {offering.Product_name} </td>       
                                                    <td style = ""padding: 0px 20px 0px 20px;"">
                                                        x{offering.Quantity}
                                                    </td>        
                                                    <td>${offering.Unit_retail} </td>          
                                                 </tr>          
                                            </tbody>          
                                         </table>          
                                      </td>          
                                  </tr> ";
                }

                Console.WriteLine(orders);
                string messageBody = string.Format(builder.HtmlBody,
                    name,
                    order.OrderId,
                    orders
                    );

                Console.WriteLine(messageBody);

                await _emailSender.SendEmailAsync(order.Shipping.Email, subject, messageBody, name);
            }
        }
    }
}
