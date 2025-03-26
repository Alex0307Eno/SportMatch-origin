//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Newtonsoft.Json;
//using SportMatch.Models;
//using System.Text.RegularExpressions;
//using static SportMatch.Controllers.MartController;

//namespace SportMatch.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class FavoriteController : ControllerBase
//    {
//        private readonly SportMatchV1Context MartDb;
//        public FavoriteController(SportMatchV1Context context)
//        {
//            MartDb = context;
//        }

//        public class FavoriteInfo
//        {
//            public int myHeartProductsID { get; set; }
//            public string myHeartUserEmail { get; set; }
//        }

//        [HttpPost]
//        public async Task<IActionResult> MartInfo([FromBody] FavoriteInfo favorites)
//        {
//            try
//            {
//                var FavoriteUserEmailLinqResult = await MartDb.Users
//                    .Where(u => u.Email == favorites.myHeartUserEmail)
//                    .Select(u => u.UserId)
//                    .FirstOrDefaultAsync();

//                var existingFavorite = await MartDb.ProductFavorite
//                    .FirstOrDefaultAsync(pf => pf.ProductID == favorites.myHeartProductsID && pf.UserID == FavoriteUserEmailLinqResult);
//                Console.WriteLine(JsonConvert.SerializeObject(existingFavorite, Formatting.Indented));


//                using (var transaction = await MartDb.Database.BeginTransactionAsync())
//                {
//                    if (existingFavorite != null)
//                    {
//                        // 如果兩者都對應，則刪除該記錄
//                        MartDb.ProductFavorite.Remove(existingFavorite);
//                    }
//                    else
//                    {
//                        // 如果兩者都無對應，則新增該記錄
//                        var ProductFavoriteInfo = new ProductFavorite
//                        {
//                            ProductID = favorites.myHeartProductsID,
//                            UserID = FavoriteUserEmailLinqResult
//                        };
//                        MartDb.ProductFavorite.Add(ProductFavoriteInfo);
//                    }

//                    // 提交交易
//                    await MartDb.SaveChangesAsync();
//                    await transaction.CommitAsync();
//                    // 交易結果是空或是滿
//                    return Ok(new { storage = existingFavorite != null ? "nuel" : "fill" });
//                }
//            }
//            catch (Exception ex)
//            {
//                // 發生錯誤，回滾交易
//                return StatusCode(500, new { message = $"錯誤發生: {ex.Message}" });
//            }
//        }
//    }
//}
