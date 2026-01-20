using MyApp.Domain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Domain.Entities
{
    public class InstructorJobTitles : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public ICollection<Instructor> Instructors { get; set; } = new List<Instructor>();

    }
}
