using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.Identity.Client.Extensions.Msal;
using Newtonsoft.Json;
using SportMatch.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using static SportMatch.Controllers.MartController;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly SportMatchV1Context MartDb;
    public ProductsController(SportMatchV1Context context)
    {
        MartDb = context;
    }

    [HttpGet]
    public IActionResult GetProducts(int page, int itemsPerPage, string orderByDesc, string _categoryName, string _subCategoryName, string _myHeartUserEmail)
    {
        List<string> subCategoryNames = _subCategoryName.Split(',').ToList() ?? new List<string>();
        var productsQuery =
            from P in MartDb.Products
            join PM in MartDb.ProductCategoryMappings on P.ProductId equals PM.ProductId
            join PC in MartDb.ProductCategories on PM.CategoryId equals PC.CategoryId
            join PSC in MartDb.ProductSubCategories on PM.SubCategoryId equals PSC.SubCategoryId
            orderby (orderByDesc == "none" ? P.ProductId : (orderByDesc == "high" ? P.Price : -P.Price))
            where (_categoryName == "全部" ? true : (PC.CategoryName == _categoryName && (subCategoryNames.Contains("無") || subCategoryNames.Any(subCategory => PSC.SubCategoryName == subCategory))))
            select new
            {
                productID = P.ProductId,
                name = P.ProductName,
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
            from PF in MartDb.Favorites
            join P in MartDb.Products on PF.MyFavorite equals P.ProductId
            join U in MartDb.Users on PF.UserId equals U.UserId
            where PF.Type == "商品"
            select new
            {
                productID = PF.MyFavorite,
                storage = (((PF.Type == "商品" && PF.MyFavorite == P.ProductId) && U.Email == _myHeartUserEmail) ? "fill" : null)
            };

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

        Console.WriteLine("\n\n\n");
        Console.WriteLine(JsonConvert.SerializeObject(combinedQuery, Formatting.Indented));
        Console.WriteLine("\n\n\n");
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
