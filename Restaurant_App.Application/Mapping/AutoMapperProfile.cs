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
            // Category Mapping
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products));
            CreateMap<CategoryDTO, Category>()
                .ForMember(dest => dest.Products, opt => opt.MapFrom(src => src.Products));

            // Product Mapping
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => src.Images.Select(i => i.ImageUrl)))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

            
            CreateMap<ProductDTO, Product>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ImageUrls.Select(url => new Image { ImageUrl = url })))
                .ForMember(dest => dest.Name, opt => opt.Ignore());

            // User Mapping
            CreateMap<ApplicationUser, UserRegisterDTO>()
                .ReverseMap()
                .AfterMap((dto, user) =>
                {
                    user.Email = dto.Email;
                    user.UserName = dto.Email;
                    user.FullName = dto.FullName;
                });

            // Cart Mapping
            CreateMap<Cart, CartDTO>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems));
            CreateMap<CartDTO, Cart>()
                .ForMember(dest => dest.CartItems, opt => opt.MapFrom(src => src.Items));

            CreateMap<CartItem, CartItemDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
            CreateMap<CartItemDTO, CartItem>()
                .ForMember(dest => dest.ProductName, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            // Reservation Mapping
            CreateMap<Reservation, ReservationDTO>();
            CreateMap<ReservationDTO, Reservation>();

            CreateMap<Rating, RatingDTO>();
            CreateMap<RatingDTO, Rating>();

            // Comment Mapping
            CreateMap<Comment, CommentDTO>();
            CreateMap<CommentDTO, Comment>();

            // Table Mapping
            CreateMap<Table, TableDTO>();
            CreateMap<TableDTO, Table>();

            // Order Mapping
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems));
            CreateMap<OrderDTO, Order>()
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.Items));

            // OrderInRestaurant Mapping
            CreateMap<OrderInRestaurant, OrderInRestaurantDTO>()
                .ForMember(dest => dest.TableNumber, opt => opt.MapFrom(src => src.Table.TableNumber))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
            CreateMap<OrderInRestaurantDTO, OrderInRestaurant>()
                .ForMember(dest => dest.Table, opt => opt.Ignore())
                .ForMember(dest => dest.TableId, opt => opt.MapFrom(src => src.TableId))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<OrderStatusInRestaurant>(src.Status, true)));

            // OrderItem Mapping
            CreateMap<OrderItem, OrderItemDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
            CreateMap<OrderItemDTO, OrderItem>()
                .ForMember(dest => dest.ProductName, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            // OrderItemInRestaurant Mapping
            CreateMap<OrderItemInRestaurant, OrderItemInRestaurantDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => (src.Product != null) ? src.Product.Name : string.Empty));
            CreateMap<OrderItemInRestaurantDTO, OrderItemInRestaurant>()
                .ForMember(dest => dest.ProductName, opt => opt.Ignore())
                .ForMember(dest => dest.Product, opt => opt.Ignore());
        }
    }
}