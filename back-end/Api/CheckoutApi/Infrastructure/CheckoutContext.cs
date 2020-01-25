using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Couchbase.Extensions.DependencyInjection;

namespace CheckoutApi.Infrastructure
{
    public interface CheckoutContext : INamedBucketProvider
    {
    }
}
