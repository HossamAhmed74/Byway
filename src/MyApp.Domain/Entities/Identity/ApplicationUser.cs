using Microsoft.AspNetCore.Identity;
using MyApp.Domain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Domain.Entities.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public string? LastModifiedBy { get; set; }
        public DateTimeOffset? LastModifiedOn { get; set; }
        public bool IsDeleted { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }
}
