namespace MyApp.Domain.Core.Models
{
    public class BaseEntity
    {
        public int Id { get; set; }
        public string? CreatedBy { get; set; }
        public DateTimeOffset CreatedOn { get; set; }
        public string? LastModifiedBy { get; set; }
        public DateTimeOffset? LastModifiedOn { get; set; }
        public bool IsDeleted { get; set; } = false;
        public bool IsActive { get; set; } = true;
    }
}