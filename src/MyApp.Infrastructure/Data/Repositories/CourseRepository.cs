using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;
using MyApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyApp.Infrastructure.Data.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CourseRepository> _logger;

        public CourseRepository(ApplicationDbContext context , ILogger<CourseRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<int> CreateCourse(CourseDto courseDto)
        {
            if (courseDto == null)
                throw new ArgumentNullException(nameof(courseDto));

            var course = new Course
            {
                Name = courseDto.Name,
                ImageUrl = courseDto.ImageUrl,
                CategoryId = courseDto.CategoryId,
                InstructorId = courseDto.InstructorId,
                Level = courseDto.Level,
                TotalHours = courseDto.TotalHours,
                Rate = courseDto.Rate,
                Cost = courseDto.Cost,
                IsSold = courseDto.IsSold,
                Description = courseDto.Description,
                Certification = courseDto.Certification
            };

            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();

            var courseId = course.Id;

            var courseContents = courseDto.CourseContents.Select(c => new CourseContent
            {
                CourseId = courseId,
                Name = c.Name,
                LecturesNumber =c.LecturesNumber,
                Time = c.Time
            }).ToList();

            await _context.CourseContents.AddRangeAsync(courseContents);
            await _context.SaveChangesAsync();

            return courseId;
        }


        public async Task<IList<CourseDto>> GetAllCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.CourseContents)
                .Include(c => c.Instructor)
                    .ThenInclude(i => i.JobTitle) 
                .Include(c => c.Category)
                .AsNoTracking()
                .ToListAsync();

            var courseDtos = courses.Select(c => new CourseDto
            {
                Id = c.Id,
                Name = c.Name,
                ImageUrl = c.ImageUrl,
                CategoryId = c.CategoryId,
                Level = c.Level,
                TotalHours = c.TotalHours,
                Rate = c.Rate,
                InstructorId = c.InstructorId,
                Description = c.Description,
                Certification = c.Certification,
                InstructorName = c.Instructor?.Name,
                InstructorImageUrl = c.Instructor?.ImageUrl,
                InstructorJobTitle = c.Instructor?.JobTitle?.Title,
                InstructorDescription = c.Instructor?.Description,
                CategoryName = c.Category?.Name,
                Cost = c.Cost,
                TotalCourseLectures = c.CourseContents.Sum(cc => int.TryParse(cc.LecturesNumber, out var n) ? n : 0),
                CourseContents = c.CourseContents.Select(cc => new CourseContentDto
                {
                    Id = cc.Id,
                    Name = cc.Name,
                    LecturesNumber = cc.LecturesNumber,
                    Time = cc.Time,
                    CourseId = cc.CourseId
                }).ToList()
            }).ToList();

            return courseDtos;
        }

        public async Task<CourseDto> GetCourseById(int id)
        {
            var course = await _context.Courses
                .Include(c => c.CourseContents)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
                throw new ArgumentNullException(nameof(course));

            return new CourseDto
            {
                Id = course.Id,
                Name = course.Name,
                ImageUrl = course.ImageUrl,
                CategoryId = course.CategoryId,
                Level = course.Level,
                TotalHours = course.TotalHours,
                Rate = course.Rate,
                Description = course.Description,
                Certification = course.Certification,
                Cost = course.Cost,
                CourseContents = course.CourseContents.Select(cc => new CourseContentDto
                {
                    Id = cc.Id,
                    Name = cc.Name,
                    LecturesNumber = cc.LecturesNumber,
                    Time = cc.Time
                }).ToList()
            };
        }
     
        public async Task UpdateCourse(CourseDto courseDto)
        {
            if (courseDto == null)
                throw new ArgumentNullException(nameof(courseDto));

            var existingCourse = await _context.Courses
                .Include(c => c.CourseContents)
                .FirstOrDefaultAsync(c => c.Id == courseDto.Id);

            if (existingCourse == null)
                throw new KeyNotFoundException($"Course with Id {courseDto.Id} not found.");

            // Update main course info
            existingCourse.Name = courseDto.Name;
            existingCourse.ImageUrl = courseDto.ImageUrl;
            existingCourse.CategoryId = courseDto.CategoryId;
            existingCourse.Level = courseDto.Level;
            existingCourse.TotalHours = courseDto.TotalHours;
            existingCourse.Rate = courseDto.Rate;
            existingCourse.Description = courseDto.Description;
            existingCourse.Certification = courseDto.Certification;
            existingCourse.Cost = courseDto.Cost;

            // Handle course contents
            var updatedContentIds = courseDto.CourseContents.Select(cc => cc.Id).ToList();

            // Remove deleted contents
            var contentsToRemove = existingCourse.CourseContents
                .Where(cc => !updatedContentIds.Contains(cc.Id))
                .ToList();

            _context.CourseContents.RemoveRange(contentsToRemove);

            // Add or update contents
            foreach (var contentDto in courseDto.CourseContents)
            {
                var existingContent = existingCourse.CourseContents
                    .FirstOrDefault(cc => cc.Id == contentDto.Id);

                if (existingContent != null)
                {
                    // Update existing content
                    existingContent.Name = contentDto.Name;
                    existingContent.LecturesNumber = contentDto.LecturesNumber;
                    existingContent.Time = contentDto.Time;
                }
                else
                {
                    // Add new content
                    var newContent = new CourseContent
                    {
                        Name = contentDto.Name,
                        LecturesNumber = contentDto.LecturesNumber,
                        Time = contentDto.Time,
                        CourseId = existingCourse.Id
                    };
                    existingCourse.CourseContents.Add(newContent);
                }
            }

            await _context.SaveChangesAsync();
        }

        private async Task<bool> IsValidToDelete(int id)
        {
            return await _context.Courses.AnyAsync(c => c.Id == id && c.IsSold == true);
        }

        public async Task<bool> DeleteCourse(int id)
        {
            var isSold = await IsValidToDelete(id);

            if (isSold)
            {
                _logger.LogInformation($"Course with ID {id} is sold and cannot be deleted.");
                return false;
            }

            var course = await _context.Courses
                .Include(c => c.CourseContents)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
                throw new KeyNotFoundException($"Course with ID {id} not found.");

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Course with ID {id} deleted successfully.");
            return true;
        }

        public async Task UpdateCourseToBeSold(List<int> ids)
        {
            var updateQuery = _context.Courses
                .Where(c => ids.Contains(c.Id));

            int affectedRows = await updateQuery.ExecuteUpdateAsync(updates => updates
                .SetProperty(c => c.IsSold, true));

            _context.ChangeTracker.Clear();
        }

    }
}

