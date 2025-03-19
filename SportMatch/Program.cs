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
    options.IdleTimeout = TimeSpan.FromMinutes(30); // �]�w Session �L���ɶ�
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



builder.Services.AddDbContext<SportMatchContext>(  // �令 SportMatchContext
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



// Add services to the container.

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "YourAppCookie";  // �]�w Cookie �W��
        options.ExpireTimeSpan = TimeSpan.FromDays(1);  // �]�w���Ĵ��� 1 ��
        options.SlidingExpiration = true;  // �ҥκu�ʹL���A�L���ɶ��|�ھڥΤᬡ�ʩ���
        options.LoginPath = "/Account/Login";  // �]�w�n�J�������|
        options.LogoutPath = "/Account/Logout";  // �]�w�n�X�������|
    });




builder.Services.AddControllersWithViews();

//builder.Services.AddScoped<AuthenticationService>();
// �o�̥[�J VerificationCodeService �M HttpContextAccessor
builder.Services.AddSingleton<VerificationCodeService>();
builder.Services.AddHttpContextAccessor(); // �� IHttpContextAccessor �i�H�Q�`�J
builder.Services.AddControllersWithViews(); // ��L�A�Ȱt�m
builder.Services.AddHttpClient(); // ���U IHttpClientFactory

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
    _ = endpoints.MapControllers(); // �T�O�����챱�������
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
