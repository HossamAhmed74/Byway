using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;
using MyApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Infrastructure.Data.Repositories
{
    public class InstructorRepository : IInstructorJobTitlesRepository, IInstructorRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<InstructorRepository> _logger;
        public InstructorRepository(ApplicationDbContext context , ILogger<InstructorRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task CreateInstructor([FromForm] InstructorDto instructor)
        {
            if(instructor!= null)
            {
                try
                {
                    var newInstructor = new Instructor
                    {
                        ImageUrl = instructor.ImageUrl,
                        Name = instructor.Name,
                        JobTitleId = instructor.JobTitleId, 
                        Rate = instructor.Rate,
                        Description = instructor.Description
                    };
                    _context.Instructors.Add(newInstructor);
                    await _context.SaveChangesAsync();
                }
                catch { throw; }
            }

        }

        public async Task<IList<InstructorDto>> GetAllInstructors()
        {
            var instructors = await _context.Instructors
                               .Include(i => i.JobTitle)
                               .Include(i => i.Courses)
                               .Where(i => !i.IsDeleted)
                               .Select(i => new InstructorDto
                               {
                                   Id = i.Id,
                                   ImageUrl = i.ImageUrl,
                                   Name = i.Name,
                                   JobTitleId = i.JobTitleId,
                                   JobTitle = i.JobTitle != null ? i.JobTitle.Title : string.Empty,
                                   Rate = i.Rate,
                                   Description = i.Description,
                                   CoursesIds = i.Courses.Where(c => c.InstructorId == i.Id).Select(c=>c.Id).ToList()
                               })
                               .ToListAsync();

            return instructors;
        }

        public async Task<List<InstructorJobTitles>> GetAllJobTitles()
        {
           var jobTitles = await _context.InstructorJobTitles.ToListAsync();
           return jobTitles;
        }

        public async Task<Instructor> GetInstructorById(int id)
        {
            var instructor = await _context.Instructors.FindAsync(id);
            if (instructor != null)
            {
                return instructor;
            }
            else
            {
                return null;
            }
        }

        public async Task DeleteInstructor(int id)
        {
            var instructorHasCourses = await GetInstructorById(id);
            if (instructorHasCourses == null)
            {
                var instructor = _context.Instructors.Find(id);
                if (instructor != null)
                {
                    instructor.IsDeleted = true;
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                _logger.LogInformation($"this instructor {id} has courses to teach");
            }
        }

        public async Task UpdateInstructor(InstructorDto instructor)
        {
           var existingInstructor = await _context.Instructors.FindAsync(instructor.Id);
              if(existingInstructor != null)
              {
                existingInstructor.ImageUrl = instructor.ImageUrl;
                existingInstructor.Name = instructor.Name;
                existingInstructor.JobTitleId = instructor.JobTitleId;
                existingInstructor.Rate = instructor.Rate;
                existingInstructor.Description = instructor.Description;
    
                await _context.SaveChangesAsync();
            }
        }
    }
}
