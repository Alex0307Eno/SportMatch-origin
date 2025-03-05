using Microsoft.AspNetCore.Mvc;
using System.Linq;
using static SportMatch.Controllers.MartController;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    // 模擬資料庫中的商品資料
    public static List<Product> products = new List<Product>
    {
        new Product {ProductID =0, Name = "商品 1", Price = 199, Discount = -20, Stock = 8, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =1, Name = "商品 2", Price = 299, Discount = -10, Stock = 1, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =2, Name = "商品 3", Price = 399, Discount =  -5, Stock = 0, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =3, Name = "商品 4", Price = 499, Discount =   0, Stock = 6, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =4, Name = "商品 5", Price = 199, Discount = -20, Stock = 0, Image = "/image/icon.jpg", MyHeart = true},
        new Product {ProductID =5, Name = "商品 6", Price = 299, Discount = -10, Stock = 8, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =6, Name = "商品 7", Price = 399, Discount =  -5, Stock = 4, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =7, Name = "商品 8", Price = 499, Discount =   0, Stock = 0, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =0, Name = "商品 9", Price = 199, Discount = -20, Stock = 8, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =1, Name = "商品 10", Price = 299, Discount = -10, Stock = 1, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =2, Name = "商品 11", Price = 399, Discount =  -5, Stock = 0, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =3, Name = "商品 12", Price = 499, Discount =   0, Stock = 6, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =4, Name = "商品 13", Price = 199, Discount = -20, Stock = 0, Image = "/image/icon.jpg", MyHeart = true},
        new Product {ProductID =5, Name = "商品 14", Price = 299, Discount = -10, Stock = 8, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =6, Name = "商品 15", Price = 399, Discount =  -5, Stock = 4, Image = "/image/icon.jpg", MyHeart = false},
        new Product {ProductID =7, Name = "商品 16", Price = 499, Discount =   0, Stock = 0, Image = "/image/icon.jpg", MyHeart = false}
    };
    // 定義 API 端點，根據頁數和每頁項目數返回商品資料

    [HttpGet]
    public IActionResult GetProducts(int page = 1, int itemsPerPage = 4)
    {

        // 計算要顯示的商品範圍
        int totalItems = Convert.ToInt32(products.Count);
        Console.WriteLine(totalItems);
        int totalPages = (int)Math.Ceiling((double)totalItems / itemsPerPage);
        Console.WriteLine(totalPages);
        // 確保頁面不超過範圍
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        // 擷取當前頁面的商品
        var pagedProducts = products.Skip((page - 1) * itemsPerPage).Take(itemsPerPage).ToList();
        Console.WriteLine(pagedProducts);
        // 返回商品資料以及分頁資訊
        var result = new
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            CurrentPage = page,
            Products = pagedProducts
        };
        Console.WriteLine(result);
        return Ok(result);
    }
}
