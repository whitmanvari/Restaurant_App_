using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using System.Security.Claims;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("process")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequestDTO model)
        {
            // Kullanıcı ID'sini token'dan alıp modele ekleyebilirsin
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            model.BuyerId = userId ?? "Guest";

            var result = await _paymentService.PayWithIyzico(model);

            if (result.Status == "success")
            {
                return Ok(new { Status = "Success", TransactionId = result.PaymentId });
            }
            else
            {
                return BadRequest(new { Status = "Failure", ErrorMessage = result.ErrorMessage });
            }
        }
    }
}