using System.Collections.Generic;

namespace CatalogApi.Model
{
    public class Disc
    {
        public string Product_key { get; set; }
        public string Product_name { get; set; }
        public string Long_description { get; set; }
        public string Offering_key { get; set; }
        public string Supplier_key { get; set; }
        public string Supplier_name { get; set; }
        public decimal Unit_retail { get; set; }
        public string Uom { get; set; }
        public string Discount_key { get; set; }
        public string Type { get; set; }
        public int MaxQty { get; set; }
        public decimal? Discount_price { get; set; }
        internal string _Tiers { get; set; }
        public List<Tiers> tiers { get; set; }
        public Disc() { }
    }
}

