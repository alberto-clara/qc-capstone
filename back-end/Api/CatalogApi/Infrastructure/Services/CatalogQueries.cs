using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CatalogApi.Model;
using CatalogApi.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Infrastructure.Services
{
    public class CatalogQueries : ICatalogQueries
    {
        protected CatalogContext CatalogContext { get; set; }
        private CatalogContext _catalogContext;

        public CatalogQueries(CatalogContext context)
        {
            _catalogContext = context;
        }

        public async Task<PaginatedItemsViewModel<PageView>> GetProducts(string sort, int pageSize, int pageIndex)
        {
            var totalItems = await _catalogContext.products.LongCountAsync();
            var newT = (from pt in _catalogContext.products
                        join ot in _catalogContext.offerings on pt.Id equals ot.Product_key
                        orderby ot.Unit_retail ascending
                        select new PageView
                        {
                            Id = pt.Id, // in future change to product_key
                            Product_name = pt.Product_name,
                            Unit_retail = Math.Round(ot.Unit_retail, 2),
                            Offering_key = ot.Id
                        }).OrderBy(p => p.Product_name);

            if (sort == "ascending")
                newT = newT.OrderBy(p => p.Unit_retail);

            else if (sort == "descending")
                newT = newT.OrderByDescending(p => p.Unit_retail);

            else if (sort == "reverse")
                newT = newT.OrderByDescending(p => p.Product_name);

            var itemsOnPage = await newT
                                   .GroupBy(p => p.Product_name)
                                   .Select(g => g.First())
                                   .Skip(pageSize * pageIndex)
                                   .Take(pageSize)
                                   .ToListAsync();

            var model = new PaginatedItemsViewModel<PageView>(
                pageIndex, pageSize, totalItems, itemsOnPage);

            return model;
        }

        public async Task<List<OfferingDiscModel>> GetOfferings(string productID)
        {
            DateTime dateTime = DateTime.Now;
            DateTimeOffset dto = DateTimeOffset.Now;
            Int64 currentUnixTimestamp = dto.ToUnixTimeSeconds();

            var newTable = (from pt in _catalogContext.products
                            join ot in _catalogContext.offerings on pt.Id equals ot.Product_key
                            join st in _catalogContext.suppliers on ot.Supplier_key equals st.Id
                            into temp
                            from rt2 in temp.DefaultIfEmpty()
                            where pt.Id == productID
                            where pt.Active_date < currentUnixTimestamp
                            orderby ot.Unit_retail
                            select new OfferingDiscModel
                            {
                                Id = pt.Id,
                                Long_description = pt.Long_description,
                                Product_name = pt.Product_name,
                                Offering_key = ot.Id,
                                Unit_retail = Math.Round(ot.Unit_retail, 2).ToString(),
//                                Unit_cost = Math.Round(ot.Unit_cost, 2).ToString(),
                                Uom = ot.Uom,
                                Supplier_key = ot.Supplier_key,
                                Supplier_name = rt2.supplier_name
                            });

            var items = await newTable
                                .ToListAsync();

            return items;
        }

        public async Task<List<OfferingDiscModel>> GetSingleOffering(string offeringID)
        {
            var result = await (from ot in _catalogContext.offerings
                                join pt in _catalogContext.products on ot.Product_key equals pt.Id
                                join st in _catalogContext.suppliers on ot.Supplier_key equals st.Id
                                into temp
                                from rt2 in temp.DefaultIfEmpty()
                                where ot.Id == offeringID
                                select new OfferingDiscModel
                                {
                                    Product_name = pt.Product_name,
                                    Long_description = pt.Long_description,
                                    Id = ot.Product_key,
                                    Offering_key = ot.Id,
                                    Unit_retail = Math.Round(ot.Unit_retail, 2).ToString(),
                                    Supplier_key = ot.Supplier_key,
                                    Supplier_name = rt2.supplier_name
                                }).ToListAsync();

            return result;
        }

        public async Task<List<OfferingDiscModel>> RandomOfferings()
        {
            Random rnd = new Random();
            var randomResults = await (from pt in _catalogContext.products
                                       join ot in _catalogContext.offerings on pt.Id equals ot.Product_key
                                       join st in _catalogContext.suppliers on ot.Supplier_key equals st.Id
                                       orderby rnd.Next()
                                       select new OfferingDiscModel
                                       {
                                           Product_name = pt.Product_name,
                                           Long_description = pt.Long_description,
                                           Offering_key = ot.Id,
                                           Id = ot.Product_key,
                                           Supplier_key = ot.Supplier_key,
                                           Unit_retail = Math.Round(ot.Unit_retail, 2).ToString(),
                                           Uom = ot.Uom,
                                           Supplier_name = st.supplier_name
                                       })
                                       .Take(15)
                                       .OrderBy(i => i.Unit_retail)
                                       .ToListAsync();

            return randomResults;
        }
    }
}
