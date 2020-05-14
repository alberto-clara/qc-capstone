using System;
using System.Collections.Generic;

/*
 * Basket document schema for the original BasketController where
 * discounts are not included. The project was setup with two 
 * different schemas to keep the original project and then the
 * project with discounts as independant as possible.
 */
namespace BasketApi.Model
{
    public class Basket
    {
        // NOT USER ID, I generate this on the backend
        public Guid? Uid { get; set; }
        public DateTime? Date { get; set; }
        public int total_items { get; set; }
        public decimal total_cost { get; set; }
        public List<Offerings> Offerings { get; set; }
        
        
        public Basket() { }
    }

    public class Offerings
    {
        public string Offering_key { get; set; }
        public string Product_key { get; set; }
        public string Product_name { get; set; }
        public string Supplier_key { get; set; }
        public string Supplier_name { get; set; }
        public decimal Unit_retail { get; set; } 
        public string Uom { get; set; }
        public int Quantity { get; set; }
        public decimal totalOfferingCost { get; set; }
    }
}
