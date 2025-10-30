using Restaurant_App.Entities.Concrete;
using Restaurant_App.WebAPI.Dto;
using AutoMapper;

namespace Restaurant_App.WebAPI.Mapping
{
    public class AutoMapperProfile: Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Category, CategoryDTO>().ReverseMap();
        }
    }
}
