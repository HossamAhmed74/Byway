using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;
using MyApp.Infrastructure.Data.Repositories;
using System.Threading;

namespace MyApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseProcessController : ControllerBase
    {
        private readonly IPurchaseProcessRepository _purchaseProcessRepository;
        private readonly ILogger<PurchaseProcessRepository> _logger;
        public PurchaseProcessController(IPurchaseProcessRepository purchaseProcessRepository, ILogger<PurchaseProcessRepository> logger)
        {
            _purchaseProcessRepository = purchaseProcessRepository;
            _logger = logger;
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult> CreateCourse([FromBody] PurchaseProcessDto purchaseProcess)
        {
            try
            {
                if (purchaseProcess == null)
                    return BadRequest("purchase Process data is null.");
                await _purchaseProcessRepository.Create(purchaseProcess);
                return Ok("purchase Process created successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Error occurred while creating purchase process: {Message}", ex.Message);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
