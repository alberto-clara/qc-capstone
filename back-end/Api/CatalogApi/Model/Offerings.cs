using System;

namespace CatalogApi.Model {
    public class Offerings {

        public string Id { get; set; }
        public int Created_date { get; set; }
        public int Active_date { get; set; }
        public int Expiration_date { get; set; }
        public int Unit_retail { get; set; }
        public int Unit_cost { get; set; }
        public string Uom { get; set; }
        public string Product_key { get; set; }
        public string Supplier_key { get; set; }

        public Offerings() { }
    }
}
