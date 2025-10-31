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



        }
    }
}
