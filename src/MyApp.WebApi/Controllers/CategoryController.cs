using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;

namespace MyApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // GET: api/category
        [HttpGet]
        [Route("GetAllCategories")]
        public async Task<ActionResult<IEnumerable<CategoriesDto>>> GetAllCategories()
        {
            try
            {
                var categories = await _categoryRepository.GetAllCategories();

                if (categories == null || !categories.Any())
                    return NotFound("No categories found.");

                return Ok(categories);
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

