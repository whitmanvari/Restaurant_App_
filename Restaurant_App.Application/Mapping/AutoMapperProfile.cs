using AutoMapper;
using Restaurant_App.Application.Dto;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using Restaurant_App.Entities.Identity;

namespace Restaurant_App.Application.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Category -> DTO
            CreateMap<Category, CategoryDTO>()
                .ForMember(dest => dest.Products, opt => opt.Ignore());

            CreateMap<CategoryDTO, Category>()
                .ForMember(dest => dest.Products, opt => opt.Ignore());

            // Product -> DTO
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.ImageUrls, opt => opt.MapFrom(src => src.Images.Select(i => i.Url)))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty))
                .ForMember(dest => dest.Allergic, opt => opt.MapFrom(src => (int)src.Allergic))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => (decimal)src.Price))
                .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.Ingredients));

            CreateMap<ProductDTO, Product>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src =>
                    src.ImageUrls != null ? src.ImageUrls.Select(url => new Image { Url = url }).ToList() : new List<Image>()
                ))
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Allergic, opt => opt.MapFrom(src => (Allergic)src.Allergic))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => (double)src.Price))
                .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.Ingredients));

            // User -> DTO
            CreateMap<ApplicationUser, UserRegisterDTO>()
                .ReverseMap()
                .AfterMap((dto, user) =>
                {
                    user.Email = dto.Email;
                    user.UserName = dto.Email;
                    user.FullName = dto.FullName;
                });

            // Cart-> DTO
            CreateMap<Cart, CartDTO>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems));
            CreateMap<CartDTO, Cart>()
                .ForMember(dest => dest.CartItems, opt => opt.MapFrom(src => src.Items));

            // CartItem->  DTO
            // CartItem -> DTO Mapping 
            CreateMap<CartItem, CartItemDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : "Bilinmeyen Ürün"))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product != null ? src.Product.Price : 0))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src =>
                    // Resim var mı kontrolü (Zincirleme null check)
                    (src.Product != null && src.Product.Images != null && src.Product.Images.Count > 0)
                    ? src.Product.Images.First().Url
                    : "" 
                ));

            CreateMap<CartItemDTO, CartItem>()
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            // Reservation
            CreateMap<Reservation, ReservationDTO>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (int)src.Status))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<ReservationDTO, Reservation>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => (ReservationStatus)src.Status));

            // Rating
            CreateMap<Rating, RatingDTO>().ReverseMap();

            // Comment
            CreateMap<Comment, CommentDTO>().ReverseMap();

            // Table
            CreateMap<Table, TableDTO>().ReverseMap();

            // Order
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderItems))
                .ForMember(dest => dest.OrderState, opt => opt.MapFrom(src => (int)src.OrderState));
            CreateMap<OrderDTO, Order>()
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.Items));

            // OrderInRestaurant
            CreateMap<OrderInRestaurant, OrderInRestaurantDTO>()
                .ForMember(dest => dest.TableNumber, opt => opt.MapFrom(src => src.Table != null ? src.Table.TableNumber : string.Empty))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<OrderInRestaurantDTO, OrderInRestaurant>()
                .ForMember(dest => dest.Table, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<OrderStatusInRestaurant>(src.Status, true)));

            // OrderItem
            CreateMap<OrderItem, OrderItemDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty));
            CreateMap<OrderItemDTO, OrderItem>()
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            // OrderItemInRestaurant
            CreateMap<OrderItemInRestaurant, OrderItemInRestaurantDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty));
            CreateMap<OrderItemInRestaurantDTO, OrderItemInRestaurant>()
                .ForMember(dest => dest.Product, opt => opt.Ignore());
        }
    }
}