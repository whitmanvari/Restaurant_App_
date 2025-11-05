using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enum;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrderInRestaurantController : ControllerBase
    {
        private readonly IOrderInRestaurantService _orderService;
        private readonly IMapper _mapper;

        public OrderInRestaurantController(IOrderInRestaurantService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        // Yeni masa siparişi oluştur
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] OrderInRestaurantDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var order = _mapper.Map<OrderInRestaurant>(dto);
            // Not: Status ve OrderDate gibi varsayılan değerler Entity'nin constructor'ında ayarlanmıştı.

            await _orderService.Create(order);

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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetOrdersWithDetails();
            var dto = _mapper.Map<List<OrderInRestaurantDTO>>(orders);
            return Ok(dto);
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
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderInRestaurantDTO dto)
        {
            // DTO'dan gelen string'i Enum'a çevirmeye çalış
            if (!Enum.TryParse<OrderStatusInRestaurant>(dto.Status, true, out var statusEnum))
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
