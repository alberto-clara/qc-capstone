using System;
using System.Collections.Generic;

namespace CheckoutApi.Models
{
    public class Checkout
    {
        public List<Order> Orders { get; set; }
    }

    public class Order
    {
        public Guid? OrderId { get; set; }
        public DateTime date { get; set; }
        public List<Offer> Offerings { get; set; }
    }

    public class Offer
    {
        public string Offering_key { get; set; }
        public string Product_key { get; set; }
        public string Product_name { get; set; }
        public string Supplier_key { get; set; }
        public string Supplier_name { get; set; }
        public int Quantity { get; set; }
        public decimal Unit_retail { get; set; }
    }
}
