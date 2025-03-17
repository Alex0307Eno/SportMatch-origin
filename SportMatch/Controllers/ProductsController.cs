using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportMatch.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using static SportMatch.Controllers.MartController;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly SportMatchContext MartDb;
    public ProductsController(SportMatchContext context)
    {
        MartDb = context;
    }

    [HttpGet]
    public IActionResult GetProducts(int page, int itemsPerPage, string orderByDesc, string _categoryName, string _subCategoryName)
    {
        List<string> subCategoryNames = _subCategoryName.Split(',').ToList() ?? new List<string>();
        //Console.WriteLine("\n\n\n\n\n" + _categoryName + " " + string.Join(", ", subCategoryNames) + "\n\n\n\n\n");
        var productsQuery =
            from P in MartDb.Product
            join PM in MartDb.ProductCategoryMapping on P.ProductID equals PM.ProductID
            join PC in MartDb.ProductCategory on PM.CategoryID equals PC.CategoryID
            join PSC in MartDb.ProductSubCategory on PM.SubCategoryID equals PSC.SubCategoryID
            orderby (orderByDesc == "none" ? P.ProductID : (orderByDesc == "high" ? P.Price : -P.Price))
            where (_categoryName == "全部" ? true : (PC.CategoryName == _categoryName && (subCategoryNames.Contains("無") || subCategoryNames.Any(subCategory => PSC.SubCategoryName == subCategory)))
)
            select new
            {
                productID = P.ProductID,
                name = P.Name,
                price = P.Price,
                discount = P.Discount,
                stock = P.Stock,
                image01 = P.Image01.Substring(P.Image01.IndexOf("t\\image") + 1).Replace("\\", "/"),
                image02 = P.Image02.Substring(P.Image02.IndexOf("t\\image") + 1).Replace("\\", "/"),
                image03 = P.Image03.Substring(P.Image03.IndexOf("t\\image") + 1).Replace("\\", "/"),
                productDetails = P.ProductDetails,
                releaseDate = P.ReleaseDate,
                categoryName = PC.CategoryName,
                subCategoryName = PSC.SubCategoryName
            };


        int totalItems = productsQuery.Count();

        // 計算總頁數
        int totalPages = (int)Math.Ceiling((double)totalItems / itemsPerPage);

        // 確保頁面不超過範圍
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        // 擷取當前頁面的商品
        var pagedProducts = productsQuery.ToList().Skip((page - 1) * itemsPerPage).Take(itemsPerPage).ToList();

        // 返回商品資料以及分頁資訊
        var result = new
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            CurrentPage = page,
            Products = pagedProducts
        };

        return Ok(result);
    }

}
