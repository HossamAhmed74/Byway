using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;

namespace MyApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorRepository _instructorRepository;
        private readonly IInstructorJobTitlesRepository _instructorJobTitlesRepository;

        public InstructorController(IInstructorJobTitlesRepository instructorJobTitlesRepository , IInstructorRepository instructorRepository)
        {
            _instructorJobTitlesRepository = instructorJobTitlesRepository;
            _instructorRepository = instructorRepository;
        }

        // GET: api/Instuctor
        [HttpGet]
        [Route("GetAllInstructors")]
        public async Task<ActionResult<IEnumerable<InstructorDto>>> GetAllInstructors()
        {
            try
            {
                var instructors = await _instructorRepository.GetAllInstructors();
                if (instructors == null || !instructors.Any())
                    return NotFound("No instructors found.");
                return Ok(instructors);
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetAllJobTitles")]
        public async Task<ActionResult<IEnumerable<InstructorJobTitlesDto>>> GetAllJobTitles()
        {
            try
            {
                var jobTitles = await _instructorJobTitlesRepository.GetAllJobTitles();
                if (jobTitles == null || !jobTitles.Any())
                    return NotFound("No job titles found.");
                return Ok(jobTitles);
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("CreateInstructor")]
        [Authorize]
        public async Task<ActionResult> CreateInstructor([FromBody]InstructorDto instructor)
        {
            try
            {
                if (instructor == null)
                    return BadRequest("Instructor data is null.");
                await _instructorRepository.CreateInstructor(instructor);
                return Ok("Instructor created successfully.");
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("UpdateInstructor")]
        [Authorize]
        public async Task<ActionResult> UpdateInstructor(InstructorDto instructor)
        {
            try
            {
                if (instructor == null)
                    return BadRequest("Instructor data is null.");
                await _instructorRepository.UpdateInstructor(instructor);
                return Ok("Instructor updated successfully.");
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete]
        [Route("DeleteInstructor/{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteInstructor(int id)
        {
            try
            {
                await _instructorRepository.DeleteInstructor(id);
                return Ok("Instructor deleted successfully.");
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("UploadImage")]
        [Authorize]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
                return BadRequest("Invalid file type. Only images are allowed.");

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest("File too large. Max 5MB allowed.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads" , "instructors");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/instructors/{fileName}";
            return Ok(new { imageUrl });
        }


    }
}
