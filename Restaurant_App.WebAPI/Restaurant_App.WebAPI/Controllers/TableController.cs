using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant_App.Application.Dto;
using Restaurant_App.Business.Abstract;
using Restaurant_App.Entities.Concrete;

namespace Restaurant_App.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TableController : ControllerBase
    {
        private readonly ITableService _tableService;
        private readonly IMapper _mapper;

        public TableController(ITableService tableService, IMapper mapper)
        {
            _tableService = tableService;
            _mapper = mapper;
        }

        // Tüm masaları detaylarıyla (Rezervasyon/Sipariş) getir (Admin)
        [HttpGet("details")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllWithDetails()
        {
            var tables = await _tableService.GetAllTablesWithDetails();
            var dto = _mapper.Map<List<TableDTO>>(tables);
            return Ok(dto);
        }

        // Sadece masaların listesini getir (Tüm kullanıcılar)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tables = await _tableService.GetAll();
            var dto = _mapper.Map<List<TableDTO>>(tables);
            return Ok(dto);
        }

        // Müsait masaları filtrele (Rezervasyon için)
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableTables([FromQuery] DateTime date, [FromQuery] int guests)
        {
            var tables = await _tableService.GetAvailableTables(date, guests);
            var dto = _mapper.Map<List<TableDTO>>(tables);
            return Ok(dto);
        }

        // Tek bir masa getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var table = await _tableService.GetById(id);
            if (table == null) return NotFound("Masa bulunamadı.");

            var dto = _mapper.Map<TableDTO>(table);
            return Ok(dto);
        }

        // Yeni masa oluştur (Admin)
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] TableDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var table = _mapper.Map<Table>(dto);
            await _tableService.Create(table);

            var responseDto = _mapper.Map<TableDTO>(table);
            return CreatedAtAction(nameof(GetById), new { id = responseDto.Id }, responseDto);
        }

        // Masa güncelle (Admin)
        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] TableDTO dto)
        {
            if (id != dto.Id)
                return BadRequest("ID uyuşmazlığı.");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _tableService.GetById(id);
            if (existing == null)
                return NotFound("Masa bulunamadı.");

            _mapper.Map(dto, existing);
            await _tableService.Update(existing);

            return Ok(_mapper.Map<TableDTO>(existing));
        }

        // Masa sil (Admin)
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var table = await _tableService.GetById(id);
            if (table == null)
                return NotFound("Masa bulunamadı.");

            await _tableService.Delete(table);
            return NoContent();
        }
    }
}
