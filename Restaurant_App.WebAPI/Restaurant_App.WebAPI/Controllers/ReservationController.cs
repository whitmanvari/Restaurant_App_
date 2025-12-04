using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto; 
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;
using Restaurant_App.Entities.Enums;
using Restaurant_App.Entities.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;

        public ReservationController(IReservationService reservationService, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _reservationService = reservationService;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")] // Sadece Adminler tüm rezervasyonları görmeli
        public async Task<IActionResult> GetAll()
        {
            var reservations = await _reservationService.GetAll();
            var dtoList = _mapper.Map<List<ReservationDTO>>(reservations);
            // ID'leri İsme Çevirme Döngüsü
            foreach (var dto in dtoList)
            {
                if (!string.IsNullOrEmpty(dto.CreatedBy))
                {
                    var user = await _userManager.FindByIdAsync(dto.CreatedBy);
                    dto.CreatedByName = user != null ? user.FullName : "Bilinmiyor";
                }
                else
                {
                    dto.CreatedByName = "Misafir / Sistem";
                }
            }
            return Ok(dtoList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var reservation = await _reservationService.GetById(id);
            if (reservation == null)
                return NotFound("Rezervasyon bulunamadı");

            var dto = _mapper.Map<ReservationDTO>(reservation);
            return Ok(dto);
        }

        [HttpGet("table/{tableId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByTable(int tableId)
        {
            var reservations = await _reservationService.GetReservationsWithTables(tableId);
            var dto = _mapper.Map<List<ReservationDTO>>(reservations);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ReservationDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = _mapper.Map<Reservation>(dto);
            entity.CreatedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Oluşturanı ekle

            await _reservationService.Create(entity);

            var responseDto = _mapper.Map<ReservationDTO>(entity);
            return CreatedAtAction(nameof(Get), new { id = responseDto.Id }, responseDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ReservationDTO dto)
        {
            if (id != dto.Id) return BadRequest("ID uyuşmazlığı.");

            var reservation = await _reservationService.GetById(id);
            if (reservation == null)
                return NotFound("Rezervasyon bulunamadı");

            // Sadece admin veya oluşturan kişi güncelleyebilir
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (reservation.CreatedBy != userId && !User.IsInRole("Admin"))
                return Unauthorized("Bu rezervasyonu güncelleme yetkiniz yok.");

            _mapper.Map(dto, reservation);
            await _reservationService.Update(reservation);

            return Ok(_mapper.Map<ReservationDTO>(reservation));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var reservation = await _reservationService.GetById(id);
            if (reservation == null)
                return NotFound("Rezervasyon bulunamadı");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (reservation.CreatedBy != userId && !User.IsInRole("Admin"))
                return Unauthorized("Bu rezervasyonu silme yetkiniz yok.");

            await _reservationService.Delete(reservation);
            return NoContent();
        }

        [HttpGet("my-reservations")]
        [Authorize]
        public async Task<IActionResult> GetMyReservations()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var all = await _reservationService.GetAll(r => r.CreatedBy == userId);
            var dto = _mapper.Map<List<ReservationDTO>>(all);
            return Ok(dto);
        }

        //Admin dışında kimse rezervasyon onaylayamayacak.
        [HttpPut("UpdateStatus/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, ReservationStatus status)
        {
            var reservation = await _reservationService.GetById(id);
            if (reservation == null) return NotFound();

            reservation.Status = status;
            await _reservationService.Update(reservation);

            return Ok();
        }
    }
}