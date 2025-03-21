using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SportMatch.Models;
using System.Text.RegularExpressions;
using static SportMatch.Controllers.MartController;

namespace SportMatch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly SportMatchContext MartDb;
        public FavoriteController(SportMatchContext context)
        {
            MartDb = context;
        }

        public class FavoriteInfo
        {
            public string isModal { get; set; }
            public int myHeartProductsID { get; set; }
            public string myHeartUserEmail { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> MartInfo([FromBody] FavoriteInfo favorites)
        {
            try
            {
                var FavoriteUserEmailLinqResult = await MartDb.Users
                    .Where(u => u.Email == favorites.myHeartUserEmail)
                    .Select(u => u.UserId)
                    .FirstOrDefaultAsync();

                var existingFavorite = await MartDb.ProductFavorite
                    .FirstOrDefaultAsync(pf => pf.ProductID == favorites.myHeartProductsID && pf.UserID == FavoriteUserEmailLinqResult);

                using (var transaction = await MartDb.Database.BeginTransactionAsync())
                {
                    if (existingFavorite != null)
                    {
                        // 如果兩者都對應，則刪除該記錄
                        MartDb.ProductFavorite.Remove(existingFavorite);
                        Console.WriteLine(JsonConvert.SerializeObject(new { existingFavorite, status = "del" }, Formatting.Indented));


                    }
                    else
                    {
                        // 如果兩者都無對應，則新增該記錄
                        var ProductFavoriteInfo = new ProductFavorite
                        {
                            ProductID = favorites.myHeartProductsID,
                            UserID = FavoriteUserEmailLinqResult
                        };
                        MartDb.ProductFavorite.Add(ProductFavoriteInfo);
                        Console.WriteLine(JsonConvert.SerializeObject(new { ProductFavoriteInfo, status = "fill" }, Formatting.Indented));
                    }

                    if (favorites.isModal != "buttonClick")
                    {
                        // 提交交易
                        await MartDb.SaveChangesAsync();
                        await transaction.CommitAsync();
                        // 如果進行了交易的結果是空或是滿
                        return Ok(new { storage = existingFavorite != null ? "nuel(not)" : "fill(not)" });
                    }
                    else {
                        // 如果只是modal打開就判斷有或沒有
                        return Ok(new { storage = existingFavorite != null ? "fill" : "nuel" });
                    }
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
