namespace BasketApi.Model
{
    public class Tiers
    {
        public decimal DiscountPercentage { get; set; }
        public string UOM { get; set; }
        public int MinQty { get; set; }
        public int MaxQty { get; set; }

        public Tiers() { }
    }
}
