using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet]
        public async Task<IActionResult> GetCartInfo(int productID, int productQuantity)
        {
            try
            {
                Console.WriteLine($"ID: {productID}, 數量: {productQuantity}");

                // 查詢產品是否存在
                var product = await MartDb.Product
                    .FirstOrDefaultAsync(p => p.ProductID == productID);

                if (product == null)
                {
                    return NotFound("產品不存在");
                }

                // 檢查庫存是否足夠
                if (product.Stock < productQuantity)
                {
                    return BadRequest("庫存不足");
                }

                // 更新庫存
                product.Stock -= productQuantity;
                await MartDb.SaveChangesAsync();

                return Ok(new { message = "庫存更新成功", productID = product.ProductID, newStock = product.Stock });
            }
            catch (Exception ex)
            {
                // 如果發生錯誤，返回 500 錯誤
                return StatusCode(500, $"錯誤發生: {ex.Message}");
            }
        }
    }
}