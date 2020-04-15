namespace CatalogApi.Model
{
    public class SupplierView
    {
        public string Product_name { get; set; }
        public string Long_description { get; set; }
        public string Product_key { get; set; }
        public string Offering_key { get; set; }
        public string Unit_retail { get; set; }
        public string Unit_cost { get; set; }
        public string Supplier_name { get; set; }
        public string Supplier_key { get; set; }
        public string Uom { get; set; }
        public SupplierView() { }
    }
}
