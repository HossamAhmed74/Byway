using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MyApp.Application.Core.Services;
using MyApp.Application.Interfaces;
using MyApp.Domain.Core.Repositories;
using MyApp.Infrastructure.Data;
using MyApp.Infrastructure.Data.Repositories;
using MyApp.Infrastructure.Repositories;
using MyApp.Infrastructure.Services;
using System;
using System.Linq;

namespace MyApp.Infrastructure
{
    public static class DependencyInjection
    {
        /// <summary>
        /// Configures infrastructure services including DbContext, repositories, and services.
        /// </summary>
        public static IServiceCollection ConfigureInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Configure Database Context
            ConfigureDatabase(services, configuration);

            // Register Repositories
            RegisterRepositories(services);

            // Register Infrastructure Services
            RegisterServices(services);

            return services;
        }

        /// <summary>
        /// Configures the database context with SQL Server.
        /// </summary>
        private static void ConfigureDatabase(
            IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    "Database connection string 'DefaultConnection' is not configured.");
            }

            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    sqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 3,
                        maxRetryDelay: TimeSpan.FromSeconds(5),
                        errorNumbersToAdd: null);
                });

                // Enable sensitive data logging in development
                options.EnableSensitiveDataLogging();
                options.EnableDetailedErrors();
            });
        }

        /// <summary>
        /// Registers all repository implementations.
        /// </summary>
        private static void RegisterRepositories(IServiceCollection services)
        {
            // Generic repository
            services.AddScoped(typeof(IBaseRepositoryAsync<>), typeof(BaseRepositoryAsync<>));

            // Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Specific repositories
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<IInstructorRepository, InstructorRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IInstructorJobTitlesRepository, InstructorRepository>();
            services.AddScoped<IPurchaseProcessRepository, PurchaseProcessRepository>();
            services.AddScoped<IAccountRepository, AccountRepository>();
        }

        /// <summary>
        /// Registers infrastructure services.
        /// </summary>
        private static void RegisterServices(IServiceCollection services)
        {
            services.AddScoped<ILoggerService, LoggerService>();
        }

        /// <summary>
        /// Automatically applies pending EF Core migrations on startup.
        /// Use with caution in production environments.
        /// </summary>
        public static void MigrateDatabase(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var logger = scope.ServiceProvider.GetService<ILogger<ApplicationDbContext>>();

            try
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var pendingMigrations = dbContext.Database.GetPendingMigrations();

                if (pendingMigrations.Any())
                {
                    logger?.LogInformation(
                        "Applying {Count} pending migration(s): {Migrations}",
                        pendingMigrations.Count(),
                        string.Join(", ", pendingMigrations));

                    dbContext.Database.Migrate();

                    logger?.LogInformation("Database migrated successfully.");
                }
                else
                {
                    logger?.LogInformation("Database is already up to date. No pending migrations.");
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Error occurred while applying database migrations.");

                // Re-throw in development to catch issues early
                throw;
            }
        }

        /// <summary>
        /// Ensures the database is created. Useful for development/testing.
        /// Do not use in production - use migrations instead.
        /// </summary>
        public static void EnsureDatabaseCreated(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var logger = scope.ServiceProvider.GetService<ILogger<ApplicationDbContext>>();

            try
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                if (dbContext.Database.EnsureCreated())
                {
                    logger?.LogInformation("Database created successfully.");
                }
                else
                {
                    logger?.LogInformation("Database already exists.");
                }
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Error occurred while ensuring database is created.");
                throw;
            }
        }
    }
}