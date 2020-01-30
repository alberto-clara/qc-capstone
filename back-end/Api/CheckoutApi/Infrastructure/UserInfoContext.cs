using Couchbase.Extensions.DependencyInjection;

namespace CheckoutApi.Infrastructure
{
    public interface UserInfoContext : INamedBucketProvider
    {
    }
}
