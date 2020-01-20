﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasketApi.Model
{
    public class Basket
    {
        public Guid? Uid { get; set; }
        public DateTime Date { get; set; }
        public Dictionary<string, Offering> Items { get; set; }
        
        public Basket() { }
    }

    public class Offering
    {
        public string Offering_key { get; set; }
        public string Product_key { get; set; }
        public string Supplier_key { get; set; }
        public decimal Unit_cost { get; set; }
        public string Uom { get; set; }
        public int Quantity { get; set; }
    }
}
