using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Dto;
using Restaurant_App.WebAPI.ViewModels.Concrete;
using System.Security.Claims;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;
        private readonly IMapper _mapper;

        public ReservationController(IReservationService reservationService, IMapper mapper)
        {
            _reservationService = reservationService;
            _mapper = mapper;
        }

        //Get all reservations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationService.GetAll();
            var dto = _mapper.Map<List<ReservationDTO>>(reservations);
            return Ok(dto);
        }

        //Get reservation by id
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var reservation = await _reservationService.GetById(id);
            if (reservation == null)
                return NotFound("Rezervasyon bulunamadı");

            var dto = _mapper.Map<ReservationDTO>(reservation);
            return Ok(dto);
        }

        //Get reservations by TableId
        [HttpGet("table/{tableId}")]
        public async Task<IActionResult> GetByTable(int tableId)
        {
            var reservations = await _reservationService.GetReservationsWithTables(tableId);
            var dto = _mapper.Map<List<ReservationDTO>>(reservations);
            return Ok(dto);
        }

        //Create reservation
        [Authorize] // Rezervasyon için login zorunlu
        [HttpPost]
        public async Task<IActionResult> Create(ReservationViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(model.Errors);

            var entity = _mapper.Map<Reservation>(model.Data);
            await _reservationService.Create(entity);

            return Ok(new { Message = "Rezervasyon oluşturuldu" });
        }

        //Update reservation
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ReservationViewModel model)
        {
            var reservation = await _reservationService.GetById(id);
            if (reservation == null)
                return NotFound("Rezervasyon bulunamadı");

            _mapper.Map(model.Data, reservation);
            await _reservationService.Update(reservation);

            return Ok(new { Message = "Rezervasyon güncellendi" });
        }

        //Delete reservation
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var reservation = await _reservationService.GetById(id);
            if (reservation == null)
                return NotFound("Rezervasyon bulunamadı");

            await _reservationService.Delete(reservation);
            return Ok(new { Message = "Rezervasyon silindi" });
        }
    }
}
