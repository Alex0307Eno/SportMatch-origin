using System.Text.Encodings.Web;
using System.Text.Unicode;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NSwag.Generation.Processors;
using SportMatch.Controllers;
using SportMatch.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>

{
    // options.IdleTimeout = TimeSpan.FromMinutes(30); // �]�w Session �L���ɶ�
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
{
    // �bProgram.cs�]�wJSON -> �C��ظm�ɡA�s�X�i��Τ@�]�w	        
    options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(
                UnicodeRanges.BasicLatin,
                UnicodeRanges.CjkUnifiedIdeographs);
});



builder.Services.AddDbContext<MyDbContext>(  // �令 UserContext
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        // options.LoginPath = "/Account/Login";  // �]�m�n�J�������|
        // options.LogoutPath = "/Account/Logout"; // �]�m�n�X���|
        options.LoginPath = "/Login"; // 設定登入頁面路徑
        options.AccessDeniedPath = "/AccessDenied"; // 權限不足時跳轉
        options.ExpireTimeSpan = TimeSpan.FromHours(2); // Cookie 過期時間
        options.SlidingExpiration = true; // 讓 Cookie 在活躍期間自動續期
    });


//builder.Services.AddScoped<AuthenticationService>();
// �o�̥[�J VerificationCodeService �M HttpContextAccessor
builder.Services.AddSingleton<VerificationCodeService>();
builder.Services.AddHttpContextAccessor(); // �� IHttpContextAccessor �i�H�Q�`�J
builder.Services.AddControllersWithViews(); // ��L�A�Ȱt�m
builder.Services.AddHttpClient(); // ���U IHttpClientFactory

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5000")
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
//Swag
builder.Services.AddOpenApiDocument(config =>
{
    config.Title = "Sport Match";
    config.Version = "v1";
    
    // config.OperationProcessors.Add(new OperationProcessor("session"));
    // config.AddSecurity("session", new NSwag.OpenApiSecurityScheme)
    // {
    //     Type = NSwag.OpenApiSecuritySchemeType.ApiKey,
    //     Name = "Cookie",
    //     In = NSwag.OpenApiSecurityApiKeyLocation.Header,
    //     Description = ""
    // }
});

var app = builder.Build();

// Configure the HTTP request pipeline.

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//Swag
if (app.Environment.IsDevelopment())
{
    // Add OpenAPI 3.0 document serving middleware
    // Available at: http://localhost:<port>/swagger/v1/swagger.json
    app.UseOpenApi();

    // Add web UIs to interact with the document
    // Available at: http://localhost:<port>/swagger
    app.UseSwaggerUi(); // UseSwaggerUI Protected by if (env.IsDevelopment())
}

app.UseSession();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    _ = endpoints.MapControllers(); // �T�O�����챱�������
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=MemberCenter}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "venue",
    pattern: "Venue/{action=Index}/{id?}",
    defaults: new { controller = "Venue", action = "Index" });

app.Run();
