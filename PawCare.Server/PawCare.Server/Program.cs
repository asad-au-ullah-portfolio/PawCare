using Scalar.AspNetCore;

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


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: PawCareCorsPolicy,
        policy =>
        {
            if (builder.Environment.IsDevelopment())
            {
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            }
            else
            {
                policy.WithOrigins("https://app.myproduct.com")
                      .AllowAnyHeader()
                      .WithMethods("GET", "POST", "PUT", "DELETE")
                      .AllowCredentials();
            }
        });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: PawCareCorsPolicy,
        policy =>
        {
            if (builder.Environment.IsDevelopment())
            {                
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            }
            else
            {                
                policy.WithOrigins("https://app.myproduct.com")
                      .AllowAnyHeader()
                      .WithMethods("GET", "POST", "PUT", "DELETE")
                      .AllowCredentials();
            }
        });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors(PawCareCorsPolicy);

app.MapGet("/healthcheck", () => new { status = "Healthy API" });

app.Run();
