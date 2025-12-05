using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity; 
using Restaurant_App.Entities.Identity; 

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderInRestaurantController : ControllerBase
    {
        private readonly IOrderInRestaurantService _orderService;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager; 

        public OrderInRestaurantController(IOrderInRestaurantService orderService, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _orderService = orderService;
            _mapper = mapper;
            _userManager = userManager;
        }

        // Yeni masa siparişi oluştur
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] OrderInRestaurantDTO dto)
        {
            // Model validasyonu başarısızsa detayları dön
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var order = _mapper.Map<OrderInRestaurant>(dto);

            // Eksik bilgileri tamamla
            order.UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Kullanıcı ID
            order.OrderDate = DateTime.Now;
            order.Status = OrderStatusInRestaurant.Pending; // Onay Bekliyor
            order.TotalAmount = dto.TotalAmount; // DTO'dan gelen tutarı al (veya backend'de tekrar hesapla)

            await _orderService.Create(order);

            // Oluşan siparişin detayını dön
            var responseDto = _mapper.Map<OrderInRestaurantDTO>(await _orderService.GetOrderWithDetails(order.Id));
            return CreatedAtAction(nameof(GetOrderDetails), new { id = responseDto.Id }, responseDto);
        }

        // Bir siparişin detaylarını getir
        [HttpGet("{id}/details")]
        public async Task<IActionResult> GetOrderDetails(int id)
        {
            var order = await _orderService.GetOrderWithDetails(id);
            if (order == null)
                return NotFound("Sipariş bulunamadı.");

            var dto = _mapper.Map<OrderInRestaurantDTO>(order);
            return Ok(dto);
        }

        // Tüm masa siparişlerini detaylı getir (Admin için)
        [HttpGet("all/details")]
        public async Task<IActionResult> GetAllWithDetails()
        {
            var orders = await _orderService.GetOrdersWithDetails();
            var dtoList = _mapper.Map<List<OrderInRestaurantDTO>>(orders);

            // Kullanıcı İsimlerini Doldur
            foreach (var dto in dtoList)
            {
                if (!string.IsNullOrEmpty(dto.UserId))
                {
                    var user = await _userManager.FindByIdAsync(dto.UserId);
                    dto.UserName = user != null ? user.FullName : "Bilinmiyor";
                }
                else
                {
                    dto.UserName = "Misafir / Garson";
                }
            }

            return Ok(dtoList);
        }

        // Masaya göre siparişleri getir
        [HttpGet("bytable/{tableId}")]
        public async Task<IActionResult> GetByTable(int tableId)
        {
            var orders = await _orderService.GetOrdersByTableId(tableId);
            var dto = _mapper.Map<List<OrderInRestaurantDTO>>(orders);
            return Ok(dto);
        }

        // Sipariş durumunu güncelle (Pending -> InProgress -> Served vb.)
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateModel model)
        {
            // Model DTO değil, basit sınıf olduğu için Validator devreye girmez.
            if (!Enum.TryParse<OrderStatusInRestaurant>(model.Status, true, out var statusEnum))
                return BadRequest("Geçersiz status değeri.");

            var order = await _orderService.GetById(id);
            if (order == null)
                return NotFound("Sipariş bulunamadı.");

            await _orderService.UpdateOrderStatus(id, statusEnum);
            return Ok(new { Message = "Sipariş durumu güncellendi." });
        }

        // Mevcut siparişe yeni ürün ekle
        [HttpPost("{id}/additem")]
        public async Task<IActionResult> AddItem(int id, [FromBody] OrderItemInRestaurantDTO itemDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = _mapper.Map<OrderItemInRestaurant>(itemDto);
            await _orderService.AddOrderItem(id, item);

            return Ok(new { Message = "Ürün siparişe eklendi." });
        }

        // Siparişten ürün sil
        [HttpDelete("{id}/removeitem/{itemId}")]
        public async Task<IActionResult> RemoveItem(int id, int itemId)
        {
            await _orderService.RemoveOrderItem(id, itemId);
            return Ok(new { Message = "Ürün siparişten silindi." });
        }

        // Siparişi sil (Admin için)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _orderService.GetById(id);
            if (order == null)
                return NotFound("Sipariş bulunamadı.");

            await _orderService.Delete(order);
            return NoContent();
        }
    }
}
