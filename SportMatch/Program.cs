using System.Text.Encodings.Web;
using System.Text.Unicode;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NSwag.Generation.Processors;
using SportMatch.Controllers;
using SportMatch.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddMemoryCache();

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



builder.Services.AddDbContext<SportMatchV1Context>(  // 改成 SportMatchV1Context
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



// Add services to the container.

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "YourAppCookie";  // 設定 Cookie 名稱
        options.ExpireTimeSpan = TimeSpan.FromDays(1);  // 設定有效期為 1 天
        options.SlidingExpiration = true;  // 啟用滾動過期，過期時間會根據用戶活動延長
        options.LoginPath = "/Account/Login";  // 設定登入頁面路徑
        options.LogoutPath = "/Account/Logout";  // 設定登出頁面路徑
    });




builder.Services.AddControllersWithViews();

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
    pattern: "{controller=Door}/{action=Door}/{id?}");
    //pattern: "{controller=Back}/{action=adminBackstage}/{id?}");


// 設置 BackController 的路由
app.MapControllerRoute(
    name: "back",
    pattern: "Back/{action=RedirectToBackstage}");

app.Run();
