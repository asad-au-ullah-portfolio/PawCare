using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using PawCare.Server;

var builder = WebApplication.CreateBuilder(args);

const string PawCareCorsPolicy = "_PawCareCorsPolicy";
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                     ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: PawCareCorsPolicy,
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowCredentials();

            if (builder.Environment.IsDevelopment())
            {
                policy.AllowAnyMethod();
            }
            else
            {
                policy.WithMethods("GET", "POST", "PUT", "DELETE");
            }
        });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<PawCareDbContext>(options =>
    options.UseInMemoryDatabase("PawCareDb"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors(PawCareCorsPolicy);

#region Basic APIs
app.MapGet("/healthcheck", () => new { status = "Healthy API" });

#endregion

#region PetCare

#endregion

app.Run();
