using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using Restaurant_App.Business.Abstract;

namespace Restaurant_App.Business.Concrete
{
    public class SmtpEmailManager : IEmailService
    {
        private readonly IConfiguration _configuration;

        public SmtpEmailManager(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendMailAsync(string toEmail, string subject, string body, bool isHtml = true)
        {
            // 1. Ayarları oku
            var emailSettings = _configuration.GetSection("EmailSettings");
            var host = emailSettings["Host"];
            var port = int.Parse(emailSettings["Port"]);
            var fromEmail = emailSettings["Mail"];
            var password = emailSettings["Password"];
            var displayName = emailSettings["DisplayName"];

            // 2. Mesajı hazırla
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(displayName, fromEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            if (isHtml) bodyBuilder.HtmlBody = body;
            else bodyBuilder.TextBody = body;

            message.Body = bodyBuilder.ToMessageBody();

            // 3. Gönderme İşlemi 
            using (var client = new SmtpClient())
            {
                try
                {
                    // SSL sertifika doğrulamasını geçici olarak devre dışı bırak (Geliştirme ortamı için)
                    client.CheckCertificateRevocation = false;

                    Console.WriteLine($"[MAIL DEBUG] Bağlanılıyor: {host}:{port}...");
                    await client.ConnectAsync(host, port, MailKit.Security.SecureSocketOptions.StartTls);

                    Console.WriteLine("[MAIL DEBUG] Kimlik doğrulanıyor...");
                    await client.AuthenticateAsync(fromEmail, password);

                    Console.WriteLine($"[MAIL DEBUG] Mail gönderiliyor: {toEmail}...");
                    await client.SendAsync(message);

                    Console.WriteLine("[MAIL DEBUG] Bağlantı kesiliyor...");
                    await client.DisconnectAsync(true);

                    Console.WriteLine("[MAIL DEBUG] BAŞARILI!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"!!! [MAIL HATASI] !!!: {ex.Message}");
                    if (ex.InnerException != null)
                        Console.WriteLine($"Inner: {ex.InnerException.Message}");

                    throw; 
                }
            }
        }
    }
}