using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PawCare.Server.Entities;
using PawCare.Server.Features.Appointments;
using PawCare.Server.Features.Auth;
using PawCare.Server.Features.Pets;
using PawCare.Server.Features.Veterinarians;
using PawCare.Server.Persistence;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

#region Cors Policy
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
#endregion

// Add services to the container.
builder.Services.AddOpenApi();

#region DB Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<PawCareDbContext>(options =>
    options.UseNpgsql(connectionString)); 
#endregion

builder.Services.AddDataProtection();

#region Identity and JWT
builder.Services
.AddIdentityCore<ApplicationUser>(options =>
{
options.User.RequireUniqueEmail = true;

options.Password.RequiredLength = 6;
options.Password.RequireDigit = true;
options.Password.RequireUppercase = false;
options.Password.RequireLowercase = true;
options.Password.RequireNonAlphanumeric = false;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<PawCareDbContext>()
.AddDefaultTokenProviders();

var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Signing Key is missing.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("PetOwnerOnly",
        policy => policy.RequireRole("PetOwner"));

    options.AddPolicy("VeterinarianOnly",
        policy => policy.RequireRole("Veterinarian"));
});

// Options
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName));

#endregion

#region Registered Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPetService, PetService>();
builder.Services.AddScoped<IValidator<CreatePetRequest>, CreatePetRequestValidator>();
builder.Services.AddScoped<IValidator<UpdatePetRequest>, UpdatePetRequestValidator>();
builder.Services.AddScoped<IVeterinarianService, VeterinarianService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IValidator<CreateAppointmentRequest>, CreateAppointmentRequestValidator>();

#endregion

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors(PawCareCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    foreach (var role in new[] { Roles.PetOwner, Roles.Veterinarian })
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }
}

#region End Points
app.MapAuthEndpoints();
app.MapPetEndpoints();
app.MapVeterinarianEndpoints();
app.MapAppointmentEndpoints();

#endregion

#region Basic APIs
app.MapGet("/health", () => Results.Ok("Healthy"));

#endregion

app.Run();