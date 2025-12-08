using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using Restaurant_App.Entities.Identity;
using System.Security.Claims;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService; 

        public OrderController(IOrderService orderService, IMapper mapper, UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _orderService = orderService;
            _mapper = mapper;
            _userManager = userManager;
            _emailService = emailService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] OrderDTO dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized("Kullanıcı bilgisi bulunamadı.");

            if (!ModelState.IsValid) return BadRequest(ModelState);

            var order = _mapper.Map<Order>(dto);
            order.UserId = userId;
            order.OrderDate = DateTime.Now;
            order.OrderNum = $"ORD-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";

            if (order.OrderState == 0) order.OrderState = OrderState.Waiting;

            // Toplam Tutarı Sunucuda Hesapla
            decimal calculatedTotal = 0;
            if (order.OrderItems != null)
            {
                foreach (var item in order.OrderItems)
                {
                    item.Id = 0;
                    item.OrderId = 0;
                    item.Product = null;

                    // Fiyatı topla
                    calculatedTotal += item.Price * item.Quantity;
                }
            }
            order.TotalAmount = calculatedTotal;

            try
            {
                await _orderService.Create(order);
                return Ok(new { Message = "Sipariş alındı", OrderId = order.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"DB Hatası: {ex.Message}");
            }
        }

        // Durum Güncelleme ve E-Posta ---
        [HttpPut("update-status/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromQuery] int state)
        {
            var order = await _orderService.GetOrderDetails(id); 
            if (order == null) return NotFound();

            var oldState = order.OrderState;
            order.OrderState = (OrderState)state;

            await _orderService.Update(order);

            // E-posta Gönderimi (Hazırlanıyor veya Yola Çıktı ise)
            if (oldState != order.OrderState)
            {
                string subject = $"Sipariş Durumu Güncellemesi #{order.OrderNum}";
                string message = "";

                switch (order.OrderState)
                {
                    case OrderState.Preparing:
                        message = $"Merhaba {order.FirstName}, siparişiniz şu an <b>HAZIRLANIYOR</b>. En kısa sürede yola çıkacak!";
                        break;
                    case OrderState.Completed:
<<<<<<< HEAD
                        message = $"Merhaba {order.FirstName}, siparişiniz <b>TESLİM EDİLDİ</b>. Nice diğer siparişlere, afiyet olsun!";
=======
                        message = $"Merhaba {order.FirstName}, siparişiniz <b>TESLİM EDİLDİ</b> veya tamamlandı. Afiyet olsun!";
>>>>>>> 3fe995b6d39b1db2c7c95ece8acd385ff039cedd
                        break;
                    case OrderState.Canceled:
                        message = $"Merhaba {order.FirstName}, üzgünüz siparişiniz <b>İPTAL EDİLDİ</b>. Detaylar için restoranla iletişime geçebilirsiniz.";
                        break;
                }

                if (!string.IsNullOrEmpty(message) && !string.IsNullOrEmpty(order.Email))
                {
                    // Arka planda mail at (Kullanıcıyı bekletmemek için Task.Run)
                    _ = Task.Run(() => _emailService.SendMailAsync(order.Email, subject, message));
                }
            }

            return Ok("Durum güncellendi ve kullanıcı bilgilendirildi.");
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            var orders = await _orderService.GetOrdersByUserId(userId);
            return Ok(_mapper.Map<List<OrderDTO>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetails(int id)
        {
            var order = await _orderService.GetOrderDetails(id);
            if (order == null) return NotFound();
            return Ok(_mapper.Map<OrderDTO>(order));
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAll();
            var dtoList = _mapper.Map<List<OrderDTO>>(orders);
            foreach (var dto in dtoList)
            {
                if (!string.IsNullOrEmpty(dto.UserId))
                {
                    var user = await _userManager.FindByIdAsync(dto.UserId);
                    dto.UserName = user?.FullName ?? dto.Email;
                }
            }
            return Ok(dtoList);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _orderService.GetById(id);
            if (order == null) return NotFound();
            await _orderService.Delete(order);
            return NoContent();
        }
    }
}