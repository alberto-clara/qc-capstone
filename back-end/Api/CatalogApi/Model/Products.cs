namespace CatalogApi.Model {
    public class Products {
        public string Id { get; set; }
        public string Product_name { get; set; }
        public string Long_description { get; set; }
        public int Created_date { get; set; }
        public int Active_date { get; set; }

        public Products() { }
    }
}
