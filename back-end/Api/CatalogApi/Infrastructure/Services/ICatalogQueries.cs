using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CatalogApi.Model;
using CatalogApi.ViewModel;

namespace CatalogApi.Infrastructure.Services
{
    public interface ICatalogQueries
    {
        Task<PaginatedItemsViewModel<PageView>> GetProducts(string sort, int pageSize, int pageIndex);
        Task<List<OfferingDiscModel>> GetOfferings(string productID);
        Task<List<OfferingDiscModel>> GetSingleOffering(string offeringID);
    }
}
