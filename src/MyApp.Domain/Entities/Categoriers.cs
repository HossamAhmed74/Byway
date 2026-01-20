using MyApp.Domain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Domain.Entities
{
    public class Categoriers : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
    }
}
