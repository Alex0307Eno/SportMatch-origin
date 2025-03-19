using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Newtonsoft.Json;
using SportMatch.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
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
            public string loggedInEmail { get; set; }
            public string address { get; set; }
            public string selectedPaymentMethod { get; set; }
            public string parameters { get; set; }

        }

        public class ExtendedProductInfo : ProductInfo
        {
            public int discount { get; set; }
            public string name { get; set; }
            public decimal price { get; set; }
            public string? userName { get; set; }
            public string email { get; set; } = null!;
            public string? mobile { get; set; }
        }

        internal static class SHA256Encoder
        {
            /// <summary>
            /// 雜湊加密演算法物件。
            /// </summary>
            private static readonly HashAlgorithm Crypto = null;

            static SHA256Encoder()
            {
                SHA256Encoder.Crypto = new SHA256CryptoServiceProvider();
            }

            public static string Encrypt(string originalString)
            {
                byte[] source = Encoding.Default.GetBytes(originalString);//將字串轉為Byte[]
                byte[] crypto = SHA256Encoder.Crypto.ComputeHash(source);//進行SHA256加密
                string result = string.Empty;

                for (int i = 0; i < crypto.Length; i++)
                {
                    result += crypto[i].ToString("X2");
                }

                return result.ToUpper();
            }
        }

        //private string BuildCheckMacValue([FromBody] List<ProductInfo> products)
        //{
        //    string szCheckMacValue = String.Empty;
        //    // 產生檢查碼。
        //    szCheckMacValue = String.Format("HashKey={0}{1}&HashIV={2}", "spPjZn66i0OhqJsQ", products.parameters, "hT5OJckN45isQTTs");
        //    szCheckMacValue = HttpUtility.UrlEncode(szCheckMacValue).ToLower();
        //    szCheckMacValue = SHA256Encoder.Encrypt(szCheckMacValue);

        //    return szCheckMacValue;
        //}

        [HttpPost]
        public async Task<IActionResult> CartInfo([FromBody] List<ProductInfo> products)
        {
            //Console.WriteLine(JsonConvert.SerializeObject(products, Formatting.Indented));
            try
            {                
                using (var transaction = await MartDb.Database.BeginTransactionAsync())
                {
                    var productIds = products.Select(p => p.id).ToList();

                    var userEmail = products.Select(p => p.loggedInEmail).ToList();


                    var productsLinqResult = await MartDb.Product
                        .Where(p => productIds.Contains(p.ProductID))
                        .Select(p => new { p.ProductID, p.Name, p.Price, p.Discount })
                        .ToListAsync();

                    var userLinqResult = await MartDb.Users
                        .Where(u => userEmail.Contains(u.Email))
                        .Select(u => new {u.Name, u.Email, u.Mobile})
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
                        var userDetails = userLinqResult.FirstOrDefault(u => u.Email == productInfo.loggedInEmail);

                        string szCheckMacValue = String.Empty;
                        // 產生檢查碼。
                        szCheckMacValue = String.Format("HashKey={0}{1}&HashIV={2}", "pwFHCqoQZGmho4w6", productInfo.parameters, "EkRm7iFT261dpevs");
                        szCheckMacValue = HttpUtility.UrlEncode(szCheckMacValue).ToLower();
                        szCheckMacValue = SHA256Encoder.Encrypt(szCheckMacValue);
                        Console.WriteLine("\n\n\n" + productInfo.parameters + "\n\n\n");
                        Console.WriteLine("\n\n\n" + szCheckMacValue + "\n\n\n");
                        ExtendedProductInfo extendedProductInfos = new ExtendedProductInfo
                        {
                            id = productInfo.id,
                            quantity = productInfo.quantity,
                            billNumber = productInfo.billNumber,

                            discount = productDetails.Discount,
                            name = productDetails.Name,
                            price = productDetails.Price,

                            userName = userDetails.Name,
                            email = userDetails.Email,
                            mobile = userDetails.Mobile,
                            address = productInfo.address,
                            selectedPaymentMethod = productInfo.selectedPaymentMethod,
                            parameters = szCheckMacValue
                        };

                        extendedProducts.Add(extendedProductInfos);
                    }

                    // 提交交易
                    await MartDb.SaveChangesAsync();
                    await transaction.CommitAsync();                    
                    //Console.WriteLine(string.Join(", ", extendedProducts));
                    //Console.WriteLine(JsonConvert.SerializeObject(extendedProducts, Formatting.Indented));
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
