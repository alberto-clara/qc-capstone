using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace CheckoutApi.Models
{
    public class Checkout
    {
        [JsonPropertyName("orders")]
        public Order[] Orders { get; set; }
    }

    public class Order
    {
        [JsonPropertyName("orderId")]
        public Guid? OrderId { get; set; }
        public DateTime date { get; set; }
        [JsonPropertyName("offerings")]
        public List<Offer> Offerings { get; set; }
    }

    public class Offer
    {
        [JsonPropertyName("offering_key")]
        public string Offering_key { get; set; }
        [JsonPropertyName("product_key")]
        public string Product_key { get; set; }
        [JsonPropertyName("product_name")]
        public string Product_name { get; set; }
        [JsonPropertyName("supplier_key")]
        public string Supplier_key { get; set; }
        [JsonPropertyName("supplier_name")]
        public string Supplier_name { get; set; }
        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }
        [JsonPropertyName("unit_retail")]
        public decimal Unit_retail { get; set; }
    }
}
