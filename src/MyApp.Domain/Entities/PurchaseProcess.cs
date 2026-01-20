using MyApp.Domain.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Domain.Entities
{
    public class PurchaseProcess : BaseEntity
    {
        public int CVV { get; set; }
        public string Country { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string CardName { get; set; } = string.Empty;
        public string CardNumber { get; set; }= string.Empty;
        public DateOnly ExpiryDate { get; set; }
        public double Tax { get; set; }
        public double TotalAmount { get; set; }
        public double Discount { get; set; } = 0;

        public int? UserId { get; set; }
        public string CoursesIds { get; set; } = string.Empty;
    }
}
