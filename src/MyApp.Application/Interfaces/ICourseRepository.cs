using MyApp.Application.Dtos;
using MyApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Application.Interfaces
{
    public interface ICourseRepository
    {
        Task<int> CreateCourse(CourseDto course);
        Task<CourseDto> GetCourseById(int id);
    //    Task<List<CourseDto>> GetCoursesByCategoryId(int categortId);
        Task<IList<CourseDto>> GetAllCourses();
        Task UpdateCourse(CourseDto course);
        Task UpdateCourseToBeSold(List<int> ids);
        Task<bool> DeleteCourse(int id);
    }
}
