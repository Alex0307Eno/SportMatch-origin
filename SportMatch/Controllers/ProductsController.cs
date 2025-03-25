using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.Identity.Client.Extensions.Msal;
using SportMatch.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
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
    public IActionResult GetProducts(int page, int itemsPerPage, string orderByDesc, string _categoryName, string _subCategoryName, string _myHeartUserEmail)
    {
        List<string> subCategoryNames = _subCategoryName.Split(',').ToList() ?? new List<string>();
        var productsQuery =
            from P in MartDb.Product
            join PM in MartDb.ProductCategoryMapping on P.ProductID equals PM.ProductID
            join PC in MartDb.ProductCategory on PM.CategoryID equals PC.CategoryID
            join PSC in MartDb.ProductSubCategory on PM.SubCategoryID equals PSC.SubCategoryID
            orderby (orderByDesc == "none" ? P.ProductID : (orderByDesc == "high" ? P.Price : -P.Price))
            where (_categoryName == "全部" ? true : (PC.CategoryName == _categoryName && (subCategoryNames.Contains("無") || subCategoryNames.Any(subCategory => PSC.SubCategoryName == subCategory))))
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

        var favoriteQuery =
            from PF in MartDb.Favorite
            join P in MartDb.Product on PF.MyFavorite equals P.ProductID
            join U in MartDb.Users on PF.UserID equals U.UserId
            where PF.Type == "商品"
            select new
            {
                productID = PF.MyFavorite,
                storage = (((PF.Type == "商品" && PF.MyFavorite == P.ProductID) && U.Email == _myHeartUserEmail) ? "fill" : null)
            };

        //var productStrings = favoriteQuery
        //    .Select(p => $"ProductID: {p.productID}, Name: {p.storage}")
        //    .ToList();

        var combinedQuery =
            from P in productsQuery
            join F in favoriteQuery on P.productID equals F.productID into productFavorites
            from PF in productFavorites.DefaultIfEmpty()            
            select new
            {
                P.productID,
                P.name,
                P.price,
                P.discount,
                P.stock,
                P.image01,
                P.image02,
                P.image03,
                P.productDetails,
                P.releaseDate,
                P.categoryName,
                P.subCategoryName,
                storage = ((PF.storage == null) ? "nuel" : "fill")
            };

        //var productStrings = combinedQuery
        //    .Select(p => $"ProductID: {p.productID}, Name: {p.name}, Price: {p.price:F2}, Discount: {p.discount:F2}, Stock: {p.stock}, " +  // 格式化價格和折扣，保留兩位小數
        //                $"Image01: {(string.IsNullOrEmpty(p.image01) ? "No Image" : p.image01)}, " +  // 檢查 image01 是否為 null 或空
        //                $"Image02: {(string.IsNullOrEmpty(p.image02) ? "No Image" : p.image02)}, " +  // 檢查 image02 是否為 null 或空
        //                $"Image03: {(string.IsNullOrEmpty(p.image03) ? "No Image" : p.image03)}, " +  // 檢查 image03 是否為 null 或空
        //                $"ProductDetails: {p.productDetails}, " +
        //                $"ReleaseDate: {p.releaseDate:yyyy-MM-dd}, " +  // 格式化日期
        //                $"Category: {p.categoryName}, SubCategory: {p.subCategoryName}, " +
        //                $"Storage: {p.storage}")
        //    .ToList();
        //Console.WriteLine("\n\n\n\n\n" + string.Join("\n", productStrings) + "\n\n\n\n\n");

        int totalItems = combinedQuery.Count();

        // 計算總頁數
        int totalPages = (int)Math.Ceiling((double)totalItems / itemsPerPage);

        // 確保頁面不超過範圍
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        // 擷取當前頁面的商品
        var pagedProducts = combinedQuery.Skip((page - 1) * itemsPerPage).Take(itemsPerPage).ToList();

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
