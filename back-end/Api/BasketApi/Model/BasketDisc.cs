using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasketApi.Model
{
    public class BasketDisc
    {
        public Guid? Uid { get; set; }
        public string Date { get; set; }
        public int total_items { get; set; }
        public List<OfferingsDisc> OfferingsDisc { get; set; }


        public BasketDisc() { }
    }

    public class OfferingsDisc
    {
        public string Offering_key { get; set; }
        public string Product_key { get; set; }
        public string Product_name { get; set; }
        public string Supplier_key { get; set; }
        public string Supplier_name { get; set; }
        public decimal Unit_retail { get; set; }
        public decimal? Discount_price { get; set; }
        public string Uom { get; set; }
        public int Quantity { get; set; }
    }
}
