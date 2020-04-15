﻿using System;
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
        public DateTime? date { get; set; }
        public int total_items { get; set; }
        public decimal total_cost { get; set; }
        public List<Offerings> Offerings { get; set; }
        public UserInfo Shipping { get; set; }
    }

    public class Offerings
    {
        public string Offering_key { get; set; }
        public string Product_key { get; set; }
        public string Product_name { get; set; }
        public string Supplier_key { get; set; }
        public string Supplier_name { get; set; }
        public decimal Unit_retail { get; set; }
        public string totalOfferingCost { get; set; }
        public string Uom { get; set; }
        public int Quantity { get; set; }
        
    }
}
