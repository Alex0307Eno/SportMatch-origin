using System.Text.Encodings.Web;
using System.Text.Unicode;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SportMatch.Controllers;
using SportMatch.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();
builder.Services.AddDistributedMemoryCache();
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



builder.Services.AddDbContext<SportMatchContext>(  // �令 UserContext
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));



// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";  // �]�m�n�J�������|
        options.LogoutPath = "/Account/Logout"; // �]�m�n�X���|
    });

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
    pattern: "{controller=MemberCenter}/{action=Index}/{id?}");

app.Run();
