using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
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
        // Not: Sepeti siparişe çevirme mantığı için ICartService de eklenebilir.

        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        // Yeni online sipariş oluştur
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] OrderDTO dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("Kullanıcı bilgisi bulunamadı.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var order = _mapper.Map<Order>(dto);
            order.UserId = userId; // Siparişi mevcut kullanıcıya ata
            order.OrderDate = DateTime.Now; // Sipariş tarihini sunucu saatiyle ayarla

            await _orderService.Create(order);

            var responseDto = _mapper.Map<OrderDTO>(order);
            return CreatedAtAction(nameof(GetOrderDetails), new { id = responseDto.Id }, responseDto);
        }

        // Kullanıcının KENDİ geçmiş siparişlerini getir
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized("Kullanıcı bilgisi bulunamadı.");

            var orders = await _orderService.GetOrdersByUserId(userId); //
            var dto = _mapper.Map<List<OrderDTO>>(orders);
            return Ok(dto);
        }

        // Tek bir siparişin detayını getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetails(int id)
        {
            var order = await _orderService.GetOrderDetails(id); //
            if (order == null)
                return NotFound("Sipariş bulunamadı.");

            // Kullanıcının sadece kendi siparişini veya Admin'in tüm siparişleri görmesini sağla
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (order.UserId != userId && !User.IsInRole("Admin"))
                return Unauthorized("Bu siparişi görme yetkiniz yok.");

            var dto = _mapper.Map<OrderDTO>(order);
            return Ok(dto);
        }

        // Sipariş silme (Admin için)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _orderService.GetById(id);
            if (order == null)
                return NotFound("Sipariş bulunamadı.");

            await _orderService.Delete(order);
            return NoContent();
        }

        // Admin: Tüm Paket Siparişleri Listele
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAll();
            var dto = _mapper.Map<List<OrderDTO>>(orders);
            return Ok(dto);
        }

        // Admin: Sipariş Durumunu Güncelle (Hazırlanıyor, Yola Çıktı vb.)
        [HttpPut("update-status/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromQuery] int state) // int olarak alıyoruz (Enum)
        {
            var order = await _orderService.GetById(id);
            if (order == null) return NotFound("Sipariş bulunamadı.");

            // Enum dönüşümü (OrderState: 0=Waiting, 1=Completed, 2=Canceled, 3=Preparing)
            order.OrderState = (Restaurant_App.Entities.Enums.OrderState)state;

            await _orderService.Update(order);
            return Ok("Durum güncellendi.");
        }
    }
}
