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
        private readonly SportMatchContext MartDb;

        public MartController(SportMatchContext context)
        {
            MartDb = context;
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

        public IActionResult Bill()
        {
            ViewBag.ForProducts = MartDb.Product;
            return View();
        }
    }
}
