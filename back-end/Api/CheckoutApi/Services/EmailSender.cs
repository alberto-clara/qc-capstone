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

                // create a new MimeMessage and add the sender and receiver information
                var mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress(
                    FromAddressTitle,
                    FromAddress
                    ));
                mimeMessage.To.Add(new MailboxAddress(
                    ToAddressTitle,
                    ToAddress
                    ));
                // add the subject and the html body that was built in the CheckoutController
                mimeMessage.Subject = Subject;
                mimeMessage.Body = new TextPart(TextFormat.Html)
                {
                    Text = Body
                };

                // send the email
                using (var client = new SmtpClient())
                {
                    // we are using a gmail account to send the email so connect to Google's SMTP servers
                    // SMTP server located at URL: smtp.gmail.com | PORT: 587
                    client.Connect("smtp.gmail.com", 587);
                    // Remove OAUTH2 authentication
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    // we want to use TLS not SSL
                    client.SslProtocols |= System.Security.Authentication.SslProtocols.Tls;
                    // credentials to connect the email account
                    client.Authenticate("qc.capstone@gmail.com", "kylevoos");
                    // send the email
                    await client.SendAsync(mimeMessage);
                    // disconnect from the SMTP server
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
