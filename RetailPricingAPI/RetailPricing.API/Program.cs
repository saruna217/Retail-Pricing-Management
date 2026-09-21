using Microsoft.EntityFrameworkCore;
using RetailPricing.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
builder.Services.AddDbContext<RetailPricingDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AngularPolicy");

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
