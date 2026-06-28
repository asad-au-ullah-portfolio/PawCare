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

app.MapGet("/healthcheck", () => new { status = "Healthy API" });

#region PetCare

// GET: All pets
app.MapGet("/pets", async (PawCareDbContext db) =>
    await db.Pets.ToListAsync());

// GET: Single pet by ID
app.MapGet("/pets/{id:int}", async (int id, PawCareDbContext db) =>
    await db.Pets.FindAsync(id) is Pet pet
        ? Results.Ok(pet)
        : Results.NotFound());

// POST: Add a new pet
app.MapPost("/pets", async (Pet pet, PawCareDbContext db) =>
{
    db.Pets.Add(pet);
    await db.SaveChangesAsync();
    return Results.Created($"/pets/{pet.Id}", pet);
});

// PUT: Update a pet
app.MapPut("/pets/{id:int}", async (int id, Pet inputPet, PawCareDbContext db) =>
{
    var pet = await db.Pets.FindAsync(id);
    if (pet is null) return Results.NotFound();

    pet.Name = inputPet.Name;
    pet.Species = inputPet.Species;
    pet.Age = inputPet.Age;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// DELETE: Remove a pet
app.MapDelete("/pets/{id:int}", async (int id, PawCareDbContext db) =>
{
    if (await db.Pets.FindAsync(id) is Pet pet)
    {
        db.Pets.Remove(pet);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
});

#endregion

app.Run();
