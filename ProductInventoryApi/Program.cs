using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProductInventoryApi.Data;
using ProductInventoryApi.Models;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF + SQL Server
builder.Services.AddDbContext<ProductsDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ProductsDBContext>()
    .AddDefaultTokenProviders();

// --- Prevent Identity from redirecting 401s to a login page ---
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

// JWT config
var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwt["Key"]);

// --- MODIFIED: Explicitly set Default Schemes to JWT ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// CORS Policy to allow Angular app access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        p => p.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files for Angular app (optional but good for full integration)
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Handle SPA fallback (optional - prevents 404 on refresh if Angular is served from here)
app.MapFallbackToFile("index.html");

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var ctx = scope.ServiceProvider.GetRequiredService<ProductsDBContext>();

    if (!ctx.Products.Any())
    {
        ctx.Products.AddRange(
         new Product
         {
             Name = "Laptop",
             Description = "High performance laptop",
             Price = 75000,
             Quantity = 5,
             Category = "Electronics",
             IsActive = true,
             CreatedDate = DateOnly.FromDateTime(DateTime.Now)
         },
         new Product
         {
             Name = "Wireless Mouse",
             Description = "Ergonomic mouse",
             Price = 1500,
             Quantity = 20,
             Category = "Accessories",
             IsActive = true,
             CreatedDate = DateOnly.FromDateTime(DateTime.Now)
         }
     );
        ctx.SaveChanges();
    }
}

app.Run();