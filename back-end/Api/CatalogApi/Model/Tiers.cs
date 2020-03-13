using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalogApi.Model
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
