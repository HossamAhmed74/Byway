using MyApp.Domain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Domain.Entities
{
    public class Instructor : BaseEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int JobTitleId { get; set; }
        public InstructorJobTitles? JobTitle { get; set; }
        public int Rate { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<Course> Courses { get; set; } = new ();
    }
}
