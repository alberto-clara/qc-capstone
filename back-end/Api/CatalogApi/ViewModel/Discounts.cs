using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Couchbase.Linq.Filters;

namespace CatalogApi.ViewModel
{
    [DocumentTypeFilter("Discounts")]
    public class Discounts
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("offering_keys")]
        public List<string> Offering_keys { get; set; }
        [JsonProperty("product_key")]
        public string Product_key { get; set; }
        [JsonProperty("supplier_key")]
        public string Supplier_key { get; set; }
        [JsonProperty("tiers")]
        public List<Tiers> tiers { get; set; }
        [JsonProperty("type")]
        public string Type { get; set; }
    }
    public class Tiers
    {
        [JsonProperty("DiscountPercentage")]
        public decimal DiscountPercentage { get; set; }
        [JsonProperty("UOM")]
        public string UOM { get; set; }
        [JsonProperty("MinQty")]
        public int MinQty { get; set; }
        [JsonProperty("MaxQty")]
        public int MaxQty { get; set; }
/*
        public Tiers(Tiers tiers)
        {
            DiscountPercentage = tiers.DiscountPercentage;
            MaxQty = tiers.MaxQty;
            MinQty = tiers.MinQty;
            UOM = tiers.UOM;
        }
        */
    }
}
