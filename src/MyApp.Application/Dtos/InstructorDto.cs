using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Application.Dtos
{
    public class InstructorDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int JobTitleId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public int Rate { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<int> CoursesIds { get; set; } = new();
    }
}
