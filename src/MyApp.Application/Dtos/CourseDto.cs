using MyApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Application.Dtos
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public int InstructorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public int TotalHours { get; set; }
        public int Rate { get; set; }
        public double Cost { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Certification { get; set; } = string.Empty;
        public bool IsSold { get; set; } = false;
        public string CategoryName { get; set; } = string.Empty;
        public string InstructorName { get; set; } = string.Empty;
        public string InstructorImageUrl { get; set; } = string.Empty;
        public string InstructorJobTitle { get; set; } = string.Empty;
        public string InstructorDescription { get; set; } = string.Empty;
        public int TotalCourseLectures { get; set; } 
        public IList<CourseContentDto> CourseContents { get; set; } = new List<CourseContentDto>();
    }

    public class CourseContentDto
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LecturesNumber { get; set; } = string.Empty;
        public int Time { get; set; }
    }
}
