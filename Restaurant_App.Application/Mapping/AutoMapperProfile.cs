using AutoMapper;
using Restaurant_App.Application.Dto;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enum;
using Restaurant_App.Entities.Identity;

namespace Restaurant_App.Application.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Category mapping
            CreateMap<Category, CategoryDTO>().ReverseMap();

            // Product mapping
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => src.Images.Select(i => i.ImageUrl)))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => (src.Category != null) ? src.Category.Name : string.Empty));

            CreateMap<ProductDTO, Product>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ImageUrls.Select(url => new Image { ImageUrl = url })))
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            // User mapping
            CreateMap<ApplicationUser, UserRegisterDTO>()
                .ReverseMap()
                .AfterMap((dto, user) =>
                {
                    user.Email = dto.Email;
                    user.UserName = dto.Email; // Identity için UserName genelde Email ile aynı yapılır.
                    user.FullName = dto.FullName;
                });

            // Cart mapping
            CreateMap<Cart, CartDTO>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems));
            CreateMap<CartDTO, Cart>()
                .ForMember(dest => dest.CartItems, opt => opt.MapFrom(src => src.Items));

            // CartItem mapping
            CreateMap<CartItem, CartItemDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => (src.Product != null) ? src.Product.Name : string.Empty));
            CreateMap<CartItemDTO, CartItem>()
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            // Reservation mapping
            CreateMap<Reservation, ReservationDTO>().ReverseMap();

            // Rating mapping
            CreateMap<Rating, RatingDTO>().ReverseMap();

            // Comment mapping
            CreateMap<Comment, CommentDTO>().ReverseMap();

            // Table mapping
            CreateMap<Table, TableDTO>().ReverseMap();

            // Order mapping
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems));
            CreateMap<OrderDTO, Order>()
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.Items));

            // OrderInRestaurant mapping
            CreateMap<OrderInRestaurant, OrderInRestaurantDTO>()
                .ForMember(dest => dest.TableNumber, opt => opt.MapFrom(src => (src.Table != null) ? src.Table.TableNumber : string.Empty))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<OrderInRestaurantDTO, OrderInRestaurant>()
                .ForMember(dest => dest.Table, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<OrderStatusInRestaurant>(src.Status, true)));

            // OrderItem mapping
            CreateMap<OrderItem, OrderItemDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => (src.Product != null) ? src.Product.Name : string.Empty));
            CreateMap<OrderItemDTO, OrderItem>()
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            // OrderItemInRestaurant mapping
            CreateMap<OrderItemInRestaurant, OrderItemInRestaurantDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => (src.Product != null) ? src.Product.Name : string.Empty));
            CreateMap<OrderItemInRestaurantDTO, OrderItemInRestaurant>()
                .ForMember(dest => dest.Product, opt => opt.Ignore());
        }
    }
}