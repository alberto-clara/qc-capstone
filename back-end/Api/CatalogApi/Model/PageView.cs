using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalogApi.Model
{
    public class PageView
    {
        public string Id { get; set; }
        public string Product_name { get; set; }
        public int NumProductDiscounts { get; set; }
        public decimal Unit_retail { get; set; }
        public string Discount_price { get; set; }
        public string Offering_key { get; set; }

        public PageView() { }
    }
}
