using System.Text.Encodings.Web;
using System.Text.Unicode;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SportMatch.Controllers;
using SportMatch.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddMemoryCache();

builder.Services.AddSession(options =>

{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // 設定 Session 過期時間
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
{
    // 在Program.cs設定JSON -> 每當建置時，編碼進行統一設定	        
    options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(
                UnicodeRanges.BasicLatin,
                UnicodeRanges.CjkUnifiedIdeographs);
});



builder.Services.AddDbContext<SportMatchContext>(  // 改成 SportMatchContext
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
// 這裡加入 VerificationCodeService 和 HttpContextAccessor
builder.Services.AddSingleton<VerificationCodeService>();
builder.Services.AddHttpContextAccessor(); // 讓 IHttpContextAccessor 可以被注入
builder.Services.AddControllersWithViews(); // 其他服務配置
builder.Services.AddHttpClient(); // 註冊 IHttpClientFactory

var app = builder.Build();

// Configure the HTTP request pipeline.

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseSession();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    _ = endpoints.MapControllers(); // 確保能夠找到控制器的路由
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
