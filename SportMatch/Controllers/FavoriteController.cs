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

                var existingFavorite = await MartDb.Favorite
                    .FirstOrDefaultAsync(pf => (pf.Type == "商品" && pf.MyFavorite == favorites.myHeartProductsID) && pf.UserID == FavoriteUserEmailLinqResult);
                Console.WriteLine("\n\n\n");
                Console.WriteLine(JsonConvert.SerializeObject(existingFavorite, Formatting.Indented));
                Console.WriteLine("\n\n\n");



                using (var transaction = await MartDb.Database.BeginTransactionAsync())
                {
                    if (existingFavorite != null)
                    {
                        // 如果兩者都對應，則刪除該記錄
                        MartDb.Favorite.Remove(existingFavorite);
                    }
                    else
                    {
                        // 如果兩者都無對應，則新增該記錄
                        var ProductFavoriteInfo = new Favorite
                        {
                            UserID = FavoriteUserEmailLinqResult,
                            Type = "商品",
                            MyFavorite = favorites.myHeartProductsID
                        };
                        MartDb.Favorite.Add(ProductFavoriteInfo);
                    }

                    // 提交交易
                    await MartDb.SaveChangesAsync();
                    await transaction.CommitAsync();
                    // 交易結果是空或是滿
                    return Ok(new { storage = existingFavorite != null ? "nuel" : "fill" });
                }
            }
            catch (Exception ex)
            {
                // 發生錯誤，回滾交易
                return StatusCode(500, new { message = $"錯誤發生: api連線錯誤" });
            }
        }
    }
}
