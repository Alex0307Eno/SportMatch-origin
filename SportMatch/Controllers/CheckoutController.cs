using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Newtonsoft.Json;
using SportMatch.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using static SportMatch.Controllers.CheckoutController;
using static SportMatch.Controllers.MartController;

namespace SportMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutController : ControllerBase
    {
        private readonly SportMatchContext MartDb;
        public CheckoutController(SportMatchContext context)
        {
            MartDb = context;
        }
        public class ProductInfo
        {
            public int id { get; set; }
            public int quantity { get; set; }
            public string billNumber { get; set; }
        }

        public class ExtendedProductInfo : ProductInfo
        {
            public string name { get; set; }
            public decimal price { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CartInfo([FromBody] List<ProductInfo> products)
        {
            //Console.WriteLine(JsonConvert.SerializeObject(products, Formatting.Indented));
            try
            {                
                using (var transaction = await MartDb.Database.BeginTransactionAsync())
                {
                    var productIds = products.Select(p => p.id).ToList();
                    
                    var productsLinqResult = await MartDb.Product
                        .Where(p => productIds.Contains(p.ProductID))
                        .Select(p => new { p.ProductID, p.Name, p.Price })
                        .ToListAsync();

                    List<ExtendedProductInfo> extendedProducts = new List<ExtendedProductInfo>();

                    foreach (var productInfo in products)
                    {

                        var product = await MartDb.Product
                            .FirstOrDefaultAsync(p => p.ProductID == productInfo.id);

                        if (product.Stock < productInfo.quantity)
                        {   
                            return BadRequest(new { message = $"產品ID {productInfo.id} 庫存不足" });
                        }

                        // 更新庫存
                        product.Stock -= productInfo.quantity;

                        var productDetails = productsLinqResult.FirstOrDefault(p => p.ProductID == productInfo.id);
                        //Console.WriteLine(JsonConvert.SerializeObject(productDetails, Formatting.Indented));

                        ExtendedProductInfo extendedProductInfos = new ExtendedProductInfo
                        {
                            id = productInfo.id,
                            quantity = productInfo.quantity,
                            billNumber = productInfo.billNumber,
                            name = productDetails.Name,
                            price = productDetails.Price
                        };

                        extendedProducts.Add(extendedProductInfos);
                    }

                    // 提交交易
                    await MartDb.SaveChangesAsync();
                    await transaction.CommitAsync();

                    //Console.WriteLine(string.Join(", ", products));
                    //Console.WriteLine(JsonConvert.SerializeObject(products, Formatting.Indented));
                    return Ok(extendedProducts);
                }
            } 
            catch (Exception ex)
            {
                // 發生錯誤，回滾交易
                return StatusCode(500, new { message = $"錯誤發生: {ex.Message}" });
            }
        }
    }
}
