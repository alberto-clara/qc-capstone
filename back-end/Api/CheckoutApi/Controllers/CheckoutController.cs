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
        // Couchbase buckets
        private IBucket _checkoutBucket;
        private IBucket _userInfoBucket;
        // environment, used to locate files needed for sending email
        private IHostingEnvironment _env;
        // interface used to send the email
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
         * Route to add a completed order to the users Checkout document.
         * PUT (CheckoutApi) http://localhost:7004/api/checkout/add
         * PUT (through APIGateway) http://localhost:7000/checkout-api/checkout/add
         */
        [HttpPut, Route("add")]
        public async Task<IActionResult> add([FromHeader] string authorization)
        {  
            // get the user_id from the decrypted Firebase token, stored in the HttpContext
            var currentUser = HttpContext.User;
            if (!currentUser.HasClaim(c => c.Type == "user_id"))
            {
                return BadRequest();
            }
            var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;
            // split the authorization header string to remove 'Bearer' and isolate the JWT token
            string[] auth = authorization.Split(' ');

            // build a new HTTP request to the BasketAPI to get the users Basket document
            HttpClient client = new HttpClient();
            // configuration.APIGATEWAYURL is an environment variable - found in appsettings.{env}.json
            client.BaseAddress = new Uri($"{configuration.APIGATEWAYURL}/basket-api/basket/find");
            // add the JWT token to the auth header in the HTTP request, doesn't work to just add the full one stored in authorization
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth[1]);
            // set the Content-Type header as application/json
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            // send the HTTP request and await the response
            HttpResponseMessage httpResponse = await client.GetAsync(client.BaseAddress);

            // make sure the response from the interprocess communication was successful
            if (!httpResponse.IsSuccessStatusCode)
                return BadRequest(httpResponse.StatusCode);

            // get the users Checkout document
            var userDoc = await _checkoutBucket.GetAsync<Checkout>(ID);

            // get the users UserInfo document
            var userInfoDoc = await _userInfoBucket.GetAsync<UserInfo>(ID);

            // make sure the UserInfo document was successfully retreived
            if (!userInfoDoc.Success)
            {
                if (userInfoDoc.Status != ResponseStatus.KeyNotFound)
                    return NotFound(userInfoDoc.Message);
            }

            // read the HTTP response from the BasketAPI as an Order object, this is the users current order
            Order order = await httpResponse.Content.ReadAsAsync<Order>();

            // update the information about the order, formated date in local time, generate a new GUID, add the shipping info
            order.date = DateTime.Now.ToLocalTime().ToString("MM/dd/yyyy HH:mm tt");
            order.OrderId = Guid.NewGuid();
            order.Shipping = userInfoDoc.Value;            
            Checkout checkout = null;
            // check to see if a Checkout document was successfully retreived for the user
            if (!userDoc.Success)
            {
                // make a new Checkout document for the user
                checkout = new Checkout();
                checkout.Orders = new List<Order>();
                // add the Order that was read from the HTTP response earlier to the Order array of the new document
                checkout.Orders.Add(order);
                // insert the new Checkout document for the user into the database
                var result = await _checkoutBucket.UpsertAsync(ID, checkout);

                if (!result.Success)
                    return NotFound("!userDoc.Success");
            }
            else
            {
                // if a Checkout doc already existed for the user add the new Order to the start of the array
                checkout = userDoc.Value;
                checkout.Orders = checkout.Orders.Prepend(order).ToList();

                var res = await _checkoutBucket.UpsertAsync(ID, checkout);

                if (!res.Success)
                    return NotFound("!res.Success");
            }

            // make another HTTP request to send to the BasketAPI to delete the items from the user Basket doc
            client = new HttpClient();
            client.BaseAddress = new Uri($"{configuration.APIGATEWAYURL}/basket-api/basket/delete");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth[1]);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpResponse = await client.DeleteAsync(client.BaseAddress);

            // make sure the reponse was successful
            if (!httpResponse.IsSuccessStatusCode)
                return BadRequest(httpResponse.StatusCode);

            /* only send an email if a UserInfo doc exists
             * NOTE: This should not need to be done but the frontend never required that
             * a user enter shipping information in before someone is purchasing their order
             */
            if (userInfoDoc.Success)
            {
                await SendEmail(ID, checkout.Orders[0]);
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
            // make sure the model bound correctly
            if (ModelState.IsValid)
            {
                var currentUser = HttpContext.User;

                if (!currentUser.HasClaim(c => c.Type == "user_id"))
                    return BadRequest();

                var ID = currentUser.Claims.FirstOrDefault(c => c.Type == "user_id").Value;

                // set the Uid that can be retreived from the Firebase token if its null
                if (newUserInfo.Uid == null)
                    newUserInfo.Uid = ID;

                // add the UserInfo document to the UserInfo bucket
                var result = await _userInfoBucket.UpsertAsync(ID, newUserInfo);

                if (!result.Success)
                    return BadRequest();

                return Ok(newUserInfo);
            }
            else
                return BadRequest();
        }

        /* 
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

        // function called from HTTPPUT add to send an email after a purchased order
        private async Task SendEmail(string ID, Order order)
        {
            // make sure the model bound correctly
            if (ModelState.IsValid)
            {
                // get the html template document used to build the email
                var fp = "Template"
                    + Path.DirectorySeparatorChar.ToString()
                    + "ConfirmOrder.html";

                // subject line of the email
                var subject = "qc-capstone Order Confirmation";

                // a new body for the email being sent
                var builder = new BodyBuilder();

                // read the email template - located at ./Template/ConfrimOrder.html
                using (StreamReader reader = System.IO.File.OpenText(fp))
                {
                    builder.HtmlBody = reader.ReadToEnd();
                }

                string orders = null;
                // build the name that will be formated into the email
                string name = order.Shipping.Full_name.First_name + " " + order.Shipping.Full_name.Last_name;
                // add the images to the email (never seemed to work correctly but everything I found shows this is how it was done)
                var image = builder.LinkedResources.Add("Template/Email_Templatehtml_files/right.gif");
                image.ContentId = MimeUtils.GenerateMessageId();
                // Add a section of html code for each of the individual offering that were purchased by the user in this order
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

                // format all the variables and html body into a string that will be our email messages body
                string messageBody = string.Format(builder.HtmlBody,
                    name,
                    order.OrderId,
                    orders
                    );

                // send the email: uses the interface located in CheckoutApi/Services
                await _emailSender.SendEmailAsync(order.Shipping.Email, subject, messageBody, name);
            }
        }
    }
}
