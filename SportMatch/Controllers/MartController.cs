using System.Composition;
using Microsoft.AspNetCore.Mvc;
using static SportMatch.Controllers.DoorController;
using Azure;
using static SportMatch.Controllers.MartController;
using SportMatch.Models;
using Microsoft.EntityFrameworkCore;
using Humanizer;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Newtonsoft.Json;
using System.Net.Http;
using static SportMatch.Controllers.BillController;
using System.Text;

namespace SportMatch.Controllers
{
    public class MartController : Controller
    {
        private readonly SportMatchContext MartDb;
        //private readonly IHttpClientFactory httpClientFactory;
        //private readonly IHttpContextAccessor httpContextAccessor;

        public MartController(SportMatchContext context/*, IHttpClientFactory _httpClientFactory, IHttpContextAccessor _httpContextAccessor*/)
        {
            MartDb = context;
            //httpClientFactory = _httpClientFactory;
            //httpContextAccessor = _httpContextAccessor;
        }

        public IActionResult Mart()
        {
            var CategoryLinq = (
                         from PM in MartDb.ProductCategoryMapping
                         join PC in MartDb.ProductCategory on PM.CategoryID equals PC.CategoryID
                         join PSC in MartDb.ProductSubCategory on PM.SubCategoryID equals PSC.SubCategoryID
                         group new { PC.CategoryName, PC.CategoryID, PSC.SubCategoryName, PSC.SubCategoryID } by new { PC.CategoryName, PC.CategoryID } into g
                         orderby g.Key.CategoryID
                         select new
                         {
                             SubCategoryCount = g.Select(ps => ps.SubCategoryID).Distinct().Count(),
                             CategoryName = g.Key.CategoryName,
                             CategoryID = g.Key.CategoryID,
                             SubCategoryNames = g.ToList(),
                             SubCategoryIDs = g.ToList()
                         }
                         ).ToList();

            var CategoryAdd = new List<object>();

            foreach (var item in CategoryLinq)
            {
                var _subCategorys = new Dictionary<string, string>();
                int SubCategoryCount = item.SubCategoryCount;

                for (int i = 1; i <= SubCategoryCount; i++)
                {
                    var _iName = item.SubCategoryNames
                    .Where(ps => ps.SubCategoryID == i)
                    .Select(ps => ps.SubCategoryName)
                    .FirstOrDefault();

                    if (_iName == null)
                    {
                        SubCategoryCount++;
                    }
                    else
                    {
                        int _iID = item.SubCategoryIDs
                        .Where(ps => ps.SubCategoryID == i)
                        .Select(ps => ps.SubCategoryID)
                        .FirstOrDefault();
                        _subCategorys[$"{_iID}"] = _iName;
                    }
                }

                CategoryAdd.Add(new
                {
                    CategoryName = item.CategoryName,
                    CategoryID = item.CategoryID,
                    SubCategorys = _subCategorys,
                });
            }
            ViewBag.ForCategory = CategoryAdd;
            return View();
        }

        public IActionResult Checkout()
        {
            return View();
        }

        public async Task<IActionResult> Bill()
        {
            //var scheme = httpContextAccessor.HttpContext.Request.Scheme;  // http 或 https
            //var host = httpContextAccessor.HttpContext.Request.Host.Value;  // localhost:端口號
            //var url     = $"{scheme}://{host}/api/bill";
            //Console.WriteLine(url);

            //var client = httpClientFactory.CreateClient();

            //// 序列化資料為 JSON
            //var jsonContent = JsonConvert.SerializeObject(checkoutData);
            //var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            //// 發送 POST 請求
            //var response = await client.PostAsync(url, content);

            //// 確認回應成功
            //if (response.IsSuccessStatusCode)
            //{
            //    // 解析回應的 JSON 資料
            //    var jsonResponse = await response.Content.ReadAsStringAsync();
            //    var data = JsonConvert.DeserializeObject<List<CheckoutData>>(jsonResponse);

            //    // 把資料傳遞給視圖
            //    return View(data);
            //}
            //else
            //{
            //    // 如果回應失敗，顯示錯誤訊息
            //    ViewBag.ErrorMessage = "無法從 API 取得資料";
                return View();
            //}
        }
    }
}
