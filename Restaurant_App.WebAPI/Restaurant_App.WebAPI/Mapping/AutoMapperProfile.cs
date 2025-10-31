using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Dto;
using AutoMapper;
using Restaurant_App.Business.Identity;

namespace Restaurant_App.WebAPI.Mapping
{
    public class AutoMapperProfile: Profile
    {
        public AutoMapperProfile()
        {
            //ilki kaynak, ikinci hedef.
            //ReverseMap ile ters eşleşmeyi de otomatik oluşturur.
            CreateMap<Category, CategoryDTO>().ReverseMap();

            //Userdaki FirstName ve LastName'i fullname'e mapleyeceğiz.
            CreateMap<ApplicationUser, UserRegisterDTO>()
                .ForMember(dest=> dest.FullName,
                    opt=> opt.MapFrom(src=> src.FullName))
                .ReverseMap()
                //src-->dto dest-->applicationuser 
                .AfterMap((src, dest) =>
                {
                    dest.FullName = src.FullName;
                    dest.UserName = src.Email;
                    dest.Email = src.Email;
                });

            CreateMap<Product, ProductDTO>().ReverseMap();

            //Cart ve CartItem mappingleri şöyle 
            //ReverseMap ile iki yönlü dönüşüm sağladık
            //CartItem
            CreateMap<CartItem, CartItemDTO>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ReverseMap();

            //Cart
            CreateMap<Cart, CartDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems)) // CartItems → Items
                .ReverseMap()
                .ForMember(dest => dest.CartItems, opt => opt.MapFrom(src => src.Items)); // Items → CartItems

            //Reservation mapping
            CreateMap<Reservation, ReservationDTO>()
                 .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.CustomerName))
                 .ForMember(dest => dest.CustomerPhone, opt => opt.MapFrom(src => src.CustomerPhone))
                 .ForMember(dest => dest.ReservationDate, opt => opt.MapFrom(src => src.ReservationDate))
                 .ForMember(dest => dest.NumberOfGuests, opt => opt.MapFrom(src => src.NumberOfGuests))
                 .ForMember(dest => dest.TableId, opt => opt.MapFrom(src => src.TableId))
                 .ForMember(dest => dest.SpecialRequests, opt => opt.MapFrom(src => src.SpecialRequests))
                 .ReverseMap();

        }
    }
}
