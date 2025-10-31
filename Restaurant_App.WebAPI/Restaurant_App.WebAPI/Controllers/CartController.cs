using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Dto;

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
        //sepeti getirme get methodu
        //Get api/cart
        [HttpGet]
        public async Task<IActionResult> GetMyCart()
        {
            var userId = User?.FindFirst("sub")?.Value; //jwt token içindeki sub claim genellikle userıd içerir.

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Kullanıcı bilgisi bulunamadı!");

            var cart = await _cartService.GetCartByUserId(userId);
            var cartDto = _mapper.Map<CartDTO>(cart);

            return Ok(cartDto); //sepet dto dönüyor.
        }

        //sepete ürün ekleme post methodu
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDTO itemDto)
        {
            var userId = User?.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Validasyon
            if (itemDto.ProductId <= 0 || itemDto.Quantity <= 0)
                return BadRequest("Geçersiz ürün veya miktar.");

            await _cartService.AddToCart(userId, itemDto.ProductId, itemDto.Quantity);
            return Ok("Ürün sepete eklendi.");
        }

        //sepetten ürün silme delete methodu
        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> RemoveFromCart(int productId)
        {
            var userId = User?.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var cart = await _cartService.GetCartByUserId(userId);
            if (cart == null)
                return NotFound("Sepet bulunamadı.");

            await _cartService.DeleteFromCart(cart.Id, productId);
            return Ok("Ürün sepetten silindi.");
        }

        //Sepeti temizleme delete methodu
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User?.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var cart = await _cartService.GetCartByUserId(userId);
            if (cart == null)
                return NotFound("Sepet bulunamadı.");

            await _cartService.ClearCart(cart.Id);
            return Ok("Sepet temizlendi.");
        }




    }
}
