using System;

namespace CatalogApi.Model {
    public class CatalogSuppliers {

        public string Id { get; set; }
        public string supplier_name { get; set; }
        public DateTime created_date { get; set; }
        public DateTime active_date { get; set; }

    }
}
