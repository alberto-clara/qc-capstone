using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CatalogApi.Model
{
    public class Disc
    {
        public string Product_key { get; set; }
        public string Product_name { get; set; }
        public string Long_description { get; set; }
        public string Offering_key { get; set; }
        public string Supplier_key { get; set; }
        public string Supplier_name { get; set; }
        public decimal Unit_retail { get; set; }
        public string Uom { get; set; }
        public string Discount_key { get; set; }
        public string Type { get; set; }
        public int MaxQty { get; set; }
        public decimal? Discount_price { get; set; }
        internal string _Tiers { get; set; }
//        [NotMapped]
        public List<Tiers> tiers
        {
            get; set;
//            get { return _Tiers == null ? null : JsonConvert.DeserializeObject<List<Tiers>>(_Tiers); }
 //           set { _Tiers = JsonConvert.SerializeObject(value); }
        }
        public Disc() { }

    }

    /*
    public class Tiers
    {
        public decimal DiscountPercentage { get; set; }
        public string UOM { get; set; }
        public int MinQty { get; set; }
        public int MaxQty { get; set; }
    }
    */
}

