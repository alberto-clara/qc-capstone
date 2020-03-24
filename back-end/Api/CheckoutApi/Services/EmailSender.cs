using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;

namespace CheckoutApi.Services
{
    public class EmailSender : IEmailSender
    {
        public async Task SendEmailAsync(string email, string subject, string message, string title)
        {
            try
            {
                string FromAddress = "qc.capstone@gmail.com";
                string FromAddressTitle = "qc-capstone";
                string ToAddress = email;
                string ToAddressTitle = title;
                string Subject = subject;
                string Body = message;

                var mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress(
                    FromAddressTitle,
                    FromAddress
                    ));
                mimeMessage.To.Add(new MailboxAddress(
                    ToAddressTitle,
                    ToAddress
                    ));
                mimeMessage.Subject = Subject;
                mimeMessage.Body = new TextPart(TextFormat.Html)
                {
                    Text = Body
                };

                using (var client = new SmtpClient())
                {
                    client.Connect("smtp.gmail.com", 587);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.SslProtocols |= System.Security.Authentication.SslProtocols.Tls;
                    client.Authenticate("qc.capstone@gmail.com", "kylevoos");
                    await client.SendAsync(mimeMessage);
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
