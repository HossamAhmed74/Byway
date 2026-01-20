using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyApp.Application.Dtos
{
    public class PurchaseProcessDto
    {
        public int Id { get; set; }
        public int CVV { get; set; }
        public string Country { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string CardName { get; set; } = string.Empty;
        public string CardNumber { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public List<int> CoursesIds { get; set; } = new();
        public double Tax { get; set; }
        public double TotalAmount { get; set; }
        public double Discount { get; set; } = 0;
    }
}
