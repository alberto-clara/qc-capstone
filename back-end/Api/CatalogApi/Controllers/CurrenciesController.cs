using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.Controllers
{
    [Route("api/currencies")]
    [ApiController]
    public class CurrenciesController : ControllerBase
    {
        // GET api/currencies
        [HttpGet, Route("")]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "usd", "inr", "jpy" };
        }
    }
}
