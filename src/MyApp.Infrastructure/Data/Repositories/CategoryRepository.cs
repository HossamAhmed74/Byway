using Microsoft.EntityFrameworkCore;
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
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;
        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<List<CategoriesDto>> GetAllCategories()
        {
            var categories = await _context.Categoriers.ToListAsync();
            var categoriesDto = categories.Select(c => new CategoriesDto
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();

            return categoriesDto;

        }
    }
}
