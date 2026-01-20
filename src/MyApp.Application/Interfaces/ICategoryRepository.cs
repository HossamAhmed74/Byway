using MyApp.Application.Dtos;
using MyApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Application.Interfaces
{
    public interface ICategoryRepository
    {
        Task<List<CategoriesDto>> GetAllCategories();
    }
}
