using MyApp.Domain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Domain.Entities
{
    public class Course : BaseEntity
    {
        public string ImageUrl { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public int TotalHours { get; set; } 
        public int Rate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Certification { get; set; } = string.Empty;
        public int InstructorId { get; set; }
        public double Cost { get; set; }
        public bool IsSold { get; set; } = false;
        public Categoriers? Category { get; set; }
        public Instructor? Instructor { get; set; }
        public IList<CourseContent> CourseContents { get; set; } = new List<CourseContent>();
    }

    public class CourseContent : BaseEntity
    {
        public int CourseId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LecturesNumber { get; set; } = string.Empty;
        public int Time { get; set; }
        public Course Course { get; set; } = null!;
    }
}
