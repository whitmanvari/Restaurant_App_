using AutoMapper;
using Restaurant_App.Application.Dto;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Identity;

namespace Restaurant_App.Application.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Category
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products))
                .ReverseMap();

            // Product
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => src.Images.Select(i => i.ImageUrl)))
                .ReverseMap();

            // User (Identity)
            CreateMap<ApplicationUser, UserRegisterDTO>()
                .ReverseMap()
                .AfterMap((dto, user) =>
                {
                    user.Email = dto.Email;
                    user.UserName = dto.Email;
                    user.FullName = dto.FullName;
                });

            // Cart
            CreateMap<Cart, CartDTO>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems))
                .ReverseMap()
                .ForMember(dest => dest.CartItems, opt => opt.MapFrom(src => src.Items));

            // Cart Item
            CreateMap<CartItem, CartItemDTO>().ReverseMap();

            // Reservation
            CreateMap<Reservation, ReservationDTO>().ReverseMap();

            // Rating & Comments
            CreateMap<Rating, RatingDTO>().ReverseMap();
            CreateMap<Comment, CommentDTO>().ReverseMap();

            // Table
            CreateMap<Table, TableDTO>().ReverseMap();

            // Orders (Online)
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems))
                .ReverseMap()
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.Items));

            // Orders (Restaurant tables)
            CreateMap<OrderInRestaurant, OrderInRestaurantDTO>()
                .ReverseMap();

            // Order Items
            CreateMap<OrderItem, OrderItemDTO>().ReverseMap();
        }
    }
}