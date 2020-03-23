using System.Threading.Tasks;

namespace CheckoutApi.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message, string title);
    }
}
