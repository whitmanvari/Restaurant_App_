//using FluentValidation;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace Restaurant_App.WebAPI.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public abstract class GenericBaseController<TDto> : ControllerBase where TDto: class
//    {
//        private readonly IValidator<GenericViewModel> _validator;

//        protected GenericBaseController(IValidator<GenericViewModel> validator)
//        {
//            _validator = validator;
//        }

//        //GET: api/[controller]/{id}
//        //[HttpGet]
//        //public virtual IActionResult GetById(int id) { }
//    }
//}
