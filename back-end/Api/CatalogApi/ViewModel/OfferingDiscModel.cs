namespace CatalogApi.ViewModel
{
    public class OfferingDiscModel
    {
        public string Product_name { get; set; }
        public string Long_description { get; set; }
        public string Product_key { get; set; }
        public string Offering_key { get; set; }
        public string Unit_retail { get; set; }
        public string Uom { get; set; }
        public string Supplier_key { get; set; }
        public string Supplier_name { get; set; }
        public string Discount_price { get; set; }
        public string Discount_percentage { get; set; }
        public int MaxQty { get; set; }                
        public string Discount_key { get; set; }
        public string Type { get; set; }
    }
}
