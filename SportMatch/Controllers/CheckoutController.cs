using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Newtonsoft.Json;
using SportMatch.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
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
            public string email { get; set; }
            public string address { get; set; }
            public string selectedPaymentMethod { get; set; }
            public string userInputName { get; set; }
            public string userInputMobile { get; set; }
        }

        public class ExtendedProductInfo : ProductInfo
        {
            public int discount { get; set; }
            public string name { get; set; }
            public decimal price { get; set; }
            public string? userName { get; set; }            
            public string? mobile { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> CartInfo([FromBody] List<ProductInfo> products)
        {
            try
            {                
                using (var transaction = await MartDb.Database.BeginTransactionAsync())
                {
                    var productIds = products.Select(p => p.id).ToList();
                    var userEmail = products.Select(p => p.email).ToList();

                    var productsLinqResult = await MartDb.Product
                        .Where(p => productIds.Contains(p.ProductID))
                        .Select(p => new { p.ProductID, p.Name, p.Price, p.Discount })
                        .ToListAsync();

                    var userLinqResult = await MartDb.Users
                        .Where(u => userEmail.Contains(u.Email))
                        .Select(u => new {u.Name, u.Email, u.Mobile, u.UserId })
                        .ToListAsync();

                    List<ExtendedProductInfo> extendedProducts = new List<ExtendedProductInfo>();

                    foreach (var productInfo in products)
                    {

                        var product = await MartDb.Product
                            .FirstOrDefaultAsync(p => p.ProductID == productInfo.id);

                        var productDetails = productsLinqResult.FirstOrDefault(p => p.ProductID == productInfo.id);

                        var userDetails = userLinqResult.FirstOrDefault(u => u.Email == productInfo.email);

                        if (product.Stock < productInfo.quantity)
                        {   
                            return BadRequest(new { message = $"產品ID {productInfo.id} 庫存不足", name = productDetails.Name });
                        }

                        // 更新庫存
                        product.Stock -= productInfo.quantity;

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
                            selectedPaymentMethod = productInfo.selectedPaymentMethod
                        };
                        extendedProducts.Add(extendedProductInfos);

                        Order orderProductInfo = new Order
                        {
                            OrderNumber = productInfo.billNumber,
                            ProductId = productInfo.id,
                            UserId = userDetails.UserId,
                            Quantity = productInfo.quantity,
                            Payment = productInfo.selectedPaymentMethod
                        };

                        MartDb.Orders.Add(orderProductInfo);

                        var userNameAndMobile = await MartDb.Users
                            .FirstOrDefaultAsync(u => u.Email == productInfo.email);

                        var deliveryInfoNameAndMobile = await MartDb.DeliveryInfo
                            .Select(d => new { d.Recepient, d.Phone, d.Address})
                            .ToListAsync();                        

                        if (deliveryInfoNameAndMobile.All(
                            d => d.Recepient != productInfo.userInputName ||
                                 d.Phone != productInfo.userInputMobile ||
                                 d.Address != productInfo.address)){

                            DeliveryInfo addDeliveryInfo = new DeliveryInfo
                            {
                                Address = productInfo.address,
                                UserID = userDetails.UserId
                            };

                            if (deliveryInfoNameAndMobile.All(d => d.Recepient != userNameAndMobile.Name) && userNameAndMobile.Name == "")
                            {
                                //Console.WriteLine("\n\n\n");
                                //Console.WriteLine(JsonConvert.SerializeObject(addDeliveryInfo, Formatting.Indented));
                                //Console.WriteLine("\n\n\n");
                                if (productInfo.userInputName != "")
                                {
                                    string namePattern = @"^[\u4e00-\u9fa5]{2,5}$";
                                    if (Regex.IsMatch(productInfo.userInputName, namePattern))
                                    {
                                        addDeliveryInfo.Recepient = productInfo.userInputName;
                                        extendedProductInfos.userName = productInfo.userInputName;
                                    }
                                    else
                                    {
                                        return BadRequest(new { message = "姓名格式錯誤" });
                                    }
                                }
                                else
                                {
                                    return BadRequest(new { message = "尚未登錄姓名" });
                                }
                            }
                            if (deliveryInfoNameAndMobile.All(d => d.Phone != userNameAndMobile.Mobile) && userNameAndMobile.Mobile == "")
                            {
                                if (productInfo.userInputMobile != "")
                                {
                                    string mobilePattern = @"^(09)[0-9]{8}$";
                                    if (Regex.IsMatch(productInfo.userInputMobile, mobilePattern))
                                    {
                                        addDeliveryInfo.Phone = productInfo.userInputMobile;
                                        extendedProductInfos.mobile = productInfo.userInputMobile;
                                    }
                                    else
                                    {
                                        return BadRequest(new { message = "電話格式錯誤" });
                                    }
                                }
                                else
                                {
                                    return BadRequest(new { message = "尚未登錄電話" });
                                }
                            }                            

                            MartDb.DeliveryInfo.Add(addDeliveryInfo);
                            await MartDb.SaveChangesAsync();

                            //var getDeliveryInfoID = await MartDb.DeliveryInfo
                            //    .Where(d => d.Recepient == addDeliveryInfo.Recepient &&
                            //                d.Phone == addDeliveryInfo.Phone &&
                            //                d.Address == addDeliveryInfo.Address &&
                            //                d.UserID == addDeliveryInfo.UserID)
                            //    .Select(d => d.DeliveryInfoID)
                            //    .ToListAsync();
                            //foreach (var ID in getDeliveryInfoID) { 
                            //orderProductInfo.DeliveryInfoID = ID;
                            //}
                        }
                    }

                    // 提交交易
                    await MartDb.SaveChangesAsync();
                    await transaction.CommitAsync();                    
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
