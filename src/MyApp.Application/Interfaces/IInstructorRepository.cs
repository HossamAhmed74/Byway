using MyApp.Application.Dtos;
using MyApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Application.Interfaces
{
    public interface IInstructorRepository
    {
        Task CreateInstructor(InstructorDto instructor);
        Task<Instructor> GetInstructorById(int id);
        Task<IList<InstructorDto>> GetAllInstructors();
        Task UpdateInstructor(InstructorDto instructor);
        Task DeleteInstructor(int id);
    }
}
