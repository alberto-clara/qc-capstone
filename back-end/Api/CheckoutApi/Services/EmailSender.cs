﻿using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;

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

                string SmtpServer = "smtp.gmail.com";
                int SmtpPort = 465;

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
                mimeMessage.Body = new TextPart("html")
                {
                    Text = Body
                };

                using (var client = new SmtpClient())
                {
                    client.Connect("smtp.gmail.com", 587, false);
                    client.Authenticate("qc.capstone@gmail.com", "qc-capstone1!");
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