using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using System.Security.Claims;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // JWT token ile koruma
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;
        private readonly IMapper _mapper; //Entity-dto dönüşümleri için

        public CartController(ICartService cartService, IMapper mapper)
        {
            _cartService = cartService;
            _mapper = mapper;
        }

        // Kullanıcının sepetini getir
        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Kullanıcı bilgisi bulunamadı!");

            var cart = await _cartService.GetCartByUserId(userId);
            var cartDto = _mapper.Map<CartDTO>(cart);

            return Ok(cartDto);
        }

        // Sepete ürün ekle
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDTO itemDto)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Validasyon: Sadece ProductId ve Quantity yeterli
            if (itemDto.ProductId <= 0 || itemDto.Quantity <= 0)
                return BadRequest("Geçersiz ürün veya miktar.");

            await _cartService.AddToCart(userId, itemDto.ProductId, itemDto.Quantity);

            // GÜNCEL SEPETİ DÖN
            var cart = await _cartService.GetCartByUserId(userId);
            var cartDto = _mapper.Map<CartDTO>(cart);

            return Ok(cartDto); // 200 OK ile güncel sepeti dönüyoruz
        }
        // Sepetten ürün sil
        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var cart = await _cartService.GetCartByUserId(userId);
            if (cart == null)
                return NotFound("Sepet bulunamadı.");

            await _cartService.DeleteFromCart(cart.Id, productId);

            // Güncel sepeti dön
            return await GetMyCart();
        }

        // Sepeti temizle
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var cart = await _cartService.GetCartByUserId(userId);
            if (cart == null)
                return NotFound("Sepet bulunamadı.");

            await _cartService.ClearCart(cart.Id);

            // Güncel sepeti dön
            return await GetMyCart();
        }

        // Miktar Güncelleme
        [HttpPut("update-quantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] CartItemDTO itemDto)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            // CartItemDTO içinde ProductId ve Quantity gelmesi yeterli
            await _cartService.UpdateItemQuantity(userId, itemDto.ProductId, itemDto.Quantity);

            // Güncel sepeti geri dön (UI anında güncellensin diye)
            return await GetMyCart();
        }
    }
}


