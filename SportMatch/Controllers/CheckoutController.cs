using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using SportMatch.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
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
        }

        [HttpPost]
        public async Task<IActionResult> CartInfo([FromBody] List<ProductInfo> products)
        {
            try
            {                
                using (var transaction = await MartDb.Database.BeginTransactionAsync())
                {
                    foreach (var productInfo in products)
                    {

                        var product = await MartDb.Product
                            .FirstOrDefaultAsync(p => p.ProductID == productInfo.id);

                        if (product.Stock < productInfo.quantity)
                        {
                            Console.WriteLine($"產品ID {productInfo.id} 庫存不足");
                            return BadRequest($"產品ID {productInfo.id} 庫存不足");
                        }

                        // 更新庫存
                        product.Stock -= productInfo.quantity;
                    }

                    // 提交交易
                    await MartDb.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok("庫存更新成功");
                }
            } 
            catch (Exception ex)
            {
                // 發生錯誤，回滾交易
                return StatusCode(500, $"錯誤發生: {ex.Message}");
            }
        }
    }
}
