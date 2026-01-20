using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;

namespace MyApp.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseRepository _courseRepository;
        public CoursesController(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        // GET: api/courses
        [HttpGet]
        [Route("GetAllCourses")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetAllCourses()
        {
            try
            {
                var courses = await _courseRepository.GetAllCourses();
                if (courses == null || !courses.Any())
                    return NotFound("No courses found.");
                return Ok(courses);
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetCoursesByCategoryId")]
        //public async Task<ActionResult<IEnumerable<CourseDto>>> GetCoursesByCategoryId(int categoryId)
        //{
        //    try
        //    {
        //        var courses = await _courseRepository.GetCoursesByCategoryId(categoryId);
        //        if (courses == null || !courses.Any())
        //            return NotFound("No courses found.");
        //        return courses;
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}

        [HttpPost]
        [Authorize]
        [Route("CreateCourse")]
        public async Task<ActionResult> CreateCourse([FromBody]CourseDto course)
        {
            try
            {
                if (course == null)
                    return BadRequest("Course data is null.");
                await _courseRepository.CreateCourse(course);
                return Ok("Course created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut]
        [Authorize]
        [Route("UpdateCourse")]
        public async Task<ActionResult> UpdateCourse(CourseDto course)
        {
            try
            {
                if (course == null)
                    return BadRequest("Course data is null.");
                await _courseRepository.UpdateCourse(course);
                return Ok("Course updated successfully.");
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete]
        [Authorize]
        [Route("DeleteCourse/{id}")]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            try
            {
              var isCourseDeleted = await _courseRepository.DeleteCourse(id);
                if (isCourseDeleted)
                {
                    return Ok("Course deleted successfully.");
                }
                else
                {
                    return BadRequest("course cannot be deleted because it sold");
                }
            }
            catch (Exception ex)
            {
                // You could log the exception here (e.g. using ILogger)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost("UploadImage")]
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

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads" , "courese");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/courese/{fileName}";
            return Ok(new { imageUrl });
        }
    }
}
