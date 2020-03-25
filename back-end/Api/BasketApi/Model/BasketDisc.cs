using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace BasketApi.Model
{
    public class BasketDisc
    {
        public Guid? Uid { get; set; }
        public long Date { get; set; }
        public string total_cost { get; set; }
        public int total_items { get; set; }
        public List<OfferingsDisc> OfferingsDisc { get; set; }

        public BasketDisc() { }
    }

    public class OfferingsDisc
    {
        [JsonProperty("offering_key")]
        public string Offering_key { get; set; }
        public string Product_key { get; set; }
        [JsonProperty("product_name")]
        public string Product_name { get; set; }
        [JsonProperty("supplier_key")]
        public string Supplier_key { get; set; }
        [JsonProperty("supplier_name")]
        public string Supplier_name { get; set; }
        [JsonProperty("unit_retail")]
        public string unit_retail { get; set; }
        public string totalOfferingCost { get; set; }
        [JsonProperty("discount_price")]
        public string discount_price { get; set; }
        public string Discount_key { get; set; }
        [JsonProperty("Uom")]
        public string Uom { get; set; }
        public int Quantity { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
        [JsonProperty("maxqty")]
        public int MaxQty { get; set; }
        public List<Tiers> Tiers { get; set; }
    }
}
