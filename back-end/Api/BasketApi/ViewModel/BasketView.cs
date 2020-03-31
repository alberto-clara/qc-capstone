using System;
using System.Collections.Generic;
using BasketApi.Model;
using Newtonsoft.Json;
using Couchbase.Linq.Filters;

namespace BasketApi.ViewModel
{
    [DocumentTypeFilter("BasketDisc")]
    public class BasketView
    {
        public Guid? Uid { get; set; }
        internal long Date { get; set; }
        public string total_cost { get; set; }
        public int total_items { get; set; }
        public List<OfferingsDisc> OfferingsDisc { get; set; }

        public BasketView() { }
    }
}
