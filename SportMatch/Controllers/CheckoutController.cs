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
        private readonly SportMatchV1Context MartDb;
        public CheckoutController(SportMatchV1Context context)
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

                    var productsLinqResult = await MartDb.Products
                        .Where(p => productIds.Contains(p.ProductId))
                        .Select(p => new { p.ProductId, p.ProductName, p.Price, p.Discount })
                        .ToListAsync();

                    var userLinqResult = await MartDb.Users
                        .Where(u => userEmail.Contains(u.Email))
                        .Select(u => new {u.Name, u.Email, u.Mobile, u.UserId })
                        .ToListAsync();

                    List<ExtendedProductInfo> extendedProducts = new List<ExtendedProductInfo>();

                    foreach (var productInfo in products)
                    {

                        var product = await MartDb.Products
                            .FirstOrDefaultAsync(p => p.ProductId == productInfo.id);

                        var productDetails = productsLinqResult.FirstOrDefault(p => p.ProductId == productInfo.id);

                        var userDetails = userLinqResult.FirstOrDefault(u => u.Email == productInfo.email);

                        if (product.Stock < productInfo.quantity)
                        {   
                            return BadRequest(new { message = $"產品ID {productInfo.id} 庫存不足", name = productDetails.ProductName });
                        }

                        // 更新庫存
                        product.Stock -= productInfo.quantity;

                        ExtendedProductInfo extendedProductInfos = new ExtendedProductInfo
                        {
                            id = productInfo.id,
                            quantity = productInfo.quantity,
                            billNumber = productInfo.billNumber,

                            discount = productDetails.Discount,
                            name = productDetails.ProductName,
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

                        var deliveryInfoNameAndMobile = await MartDb.DeliveryInfos
                            .Select(d => new { d.Recepient, d.Phone, d.Address})
                            .ToListAsync();

                        var deliveryInfoExists = await MartDb.DeliveryInfos
                            .Where(d => d.Recepient == productInfo.userInputName &&
                                     d.Phone == productInfo.userInputMobile &&
                                     d.Address == productInfo.address)
                            .FirstOrDefaultAsync();

                        if (productInfo.selectedPaymentMethod == "ComeHomepay")
                        {
                            if (productInfo.userInputName != "" && productInfo.userInputMobile != "")
                            {
                                if (deliveryInfoExists == null)
                                {
                                    DeliveryInfo addDeliveryInfo = new DeliveryInfo
                                    {
                                        Address = productInfo.address,
                                        UserId = userDetails.UserId
                                    };

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

                                    MartDb.DeliveryInfos.Add(addDeliveryInfo);
                                    await MartDb.SaveChangesAsync();
                                    orderProductInfo.DeliveryInfoId = addDeliveryInfo.DeliveryInfoId;
                                }
                                else
                                {
                                    extendedProductInfos.userName = productInfo.userInputName;
                                    extendedProductInfos.mobile = productInfo.userInputMobile;
                                    await MartDb.SaveChangesAsync();
                                    orderProductInfo.DeliveryInfoId = deliveryInfoExists.DeliveryInfoId;
                                }
                            }
                            else
                            {
                                return BadRequest(new { message = "未填寫完整收件資訊" });
                            }
                        }
                        else if (userDetails.Name != "" && userDetails.Mobile != "")
                        {
                            extendedProductInfos.userName = userDetails.Name;
                            extendedProductInfos.mobile = userDetails.Mobile;

                            orderProductInfo.DeliveryInfoId = -1;

                            await MartDb.SaveChangesAsync();
                        }
                        else {
                            return BadRequest(new { message = "未填寫會員姓名電話" });
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
