using System;

namespace CatalogApi.Model {
    public class CatalogOfferings {

        public string Id { get; set; }
        public DateTime created_date { get; set; }
        public DateTime active_date { get; set; }
        public DateTime expiration_date { get; set; }
        public int unit_retail { get; set; }
        public int unit_cost { get; set; }
        public string uom { get; set; }
        public string product_key { get; set; }
        public string supplier_key { get; set; }

    }
}
