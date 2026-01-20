using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyApp.Domain.Entities;
using MyApp.Domain.Entities.Identity;

namespace MyApp.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
   {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<Categoriers> Categoriers { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<InstructorJobTitles> InstructorJobTitles { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseContent> CourseContents { get; set; }
        public DbSet<PurchaseProcess> PurchaseProcess { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Instructor>()
                .HasOne(i => i.JobTitle)
                .WithMany(jt => jt.Instructors)
                .HasForeignKey(i => i.JobTitleId);
        }
    }
}
