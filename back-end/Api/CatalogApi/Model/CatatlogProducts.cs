using System;

namespace CatalogApi.Model {
    public class CatalogProducts {
        public string Id { get; set; }
        public string product_name { get; set; }
        public string long_description { get; set; }
        public DateTime created_date { get; set; }
        public DateTime active_date { get; set; }

    }
}
