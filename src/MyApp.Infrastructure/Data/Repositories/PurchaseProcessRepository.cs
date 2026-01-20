using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApp.Application.Dtos;
using MyApp.Application.Interfaces;
using MyApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace MyApp.Infrastructure.Data.Repositories
{
    public class PurchaseProcessRepository : IPurchaseProcessRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ICourseRepository _courseRepository;
        private readonly ILogger<PurchaseProcessRepository> _logger;
        public PurchaseProcessRepository(ApplicationDbContext context , ILogger<PurchaseProcessRepository> logger , ICourseRepository courseRepository )
        {
            _context = context;
            _logger = logger;
            _courseRepository = courseRepository;
        }

        public async Task Create(PurchaseProcessDto purchaseProcess)
        {
            try
            {
                if (purchaseProcess == null)
                {
                    _logger.LogError("PurchaseProcess object is null.");
                    throw new ArgumentNullException(nameof(purchaseProcess));
                }

                var coureseIds = purchaseProcess.CoursesIds;
                if (coureseIds == null)
                {
                    _logger.LogError("CoursesIds in PurchaseProcess is null.");
                    throw new ArgumentNullException(nameof(purchaseProcess.CoursesIds));
                }
                await _courseRepository.UpdateCourseToBeSold(coureseIds);

                var entity = new PurchaseProcess
                {
                    CardName = purchaseProcess.CardName,
                    CardNumber = purchaseProcess.CardNumber,
                    CVV = purchaseProcess.CVV,
                    Country = purchaseProcess.Country,
                    PaymentMethod = purchaseProcess.PaymentMethod,
                    State = purchaseProcess.State,
                    CoursesIds = JsonSerializer.Serialize(purchaseProcess.CoursesIds),
                    ExpiryDate = purchaseProcess.ExpiryDate,
                    UserId = purchaseProcess.UserId,
                    Discount = purchaseProcess.Discount,
                    TotalAmount = purchaseProcess.TotalAmount,
                    Tax = purchaseProcess.Tax
                };

                await _context.PurchaseProcess.AddAsync(entity);
                await _context.SaveChangesAsync();
            }
            catch { throw; }
        }
    }
}
