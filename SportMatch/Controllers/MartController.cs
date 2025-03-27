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
using System.Text;

namespace SportMatch.Controllers
{
    public class MartController : Controller
    {
        private readonly SportMatchV1Context MartDb;

        public MartController(SportMatchV1Context context)
        {
            MartDb = context;
        }

        public IActionResult Mart()
        {
            var CategoryLinq = (
                         from PM in MartDb.ProductCategoryMappings
                         join PC in MartDb.ProductCategories on PM.CategoryId equals PC.CategoryId
                         join PSC in MartDb.ProductSubCategories on PM.SubCategoryId equals PSC.SubCategoryId
                         group new { PC.CategoryName, PC.CategoryId, PSC.SubCategoryName, PSC.SubCategoryId } by new { PC.CategoryName, PC.CategoryId } into g
                         orderby g.Key.CategoryId
                         select new
                         {
                             SubCategoryCount = g.Select(ps => ps.SubCategoryId).Distinct().Count(),
                             CategoryName = g.Key.CategoryName,
                             CategoryID = g.Key.CategoryId,
                             SubCategoryNames = g.ToList(),
                             SubCategoryIds = g.ToList()
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
                    .Where(ps => ps.SubCategoryId == i)
                    .Select(ps => ps.SubCategoryName)
                    .FirstOrDefault();

                    if (_iName == null)
                    {
                        SubCategoryCount++;
                    }
                    else
                    {
                        int _iID = item.SubCategoryIds
                        .Where(ps => ps.SubCategoryId == i)
                        .Select(ps => ps.SubCategoryId)
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
    }
}
