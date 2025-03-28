using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportMatch.Models;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace SportMatch.Controllers
{
    [Authorize]  // 確保使用者登入後才能訪問
    public class BackController : Controller
    {
        private readonly SportMatchV1Context _context;

        public BackController(SportMatchV1Context context)
        {
            _context = context;
        }

        // 接收 localStorage 資料並儲存到 Session
        [HttpPost]

        public IActionResult ReceiveLocalStorage([FromBody] string userInfo)
        {
            if (!string.IsNullOrEmpty(userInfo))
            {
                // 存入 Session
                HttpContext.Session.SetString("Email", userInfo);

                // 查詢資料庫中的 UserName
                var user = _context.Users.FirstOrDefault(u => u.Email == userInfo);
                if (user != null)
                {
                    return Json(new { success = true, message = "資料已接收", userName = user.UserName });
                }
            }
            return Json(new { success = false, message = "找不到對應的使用者" });
        }


        // 供應商後台
        public IActionResult vendorBackstage()
        {
            var currentUserEmail = HttpContext.Session.GetString("Email");

            var user = _context.Users.FirstOrDefault(u => u.Email == currentUserEmail);

            if (user != null)
            {
                ViewBag.UserName = user.UserName;
            }

            return View();
        }

        // 管理員後台
        [Authorize(Roles = "admin")]
        public IActionResult adminBackstage()
        {
            var currentUserEmail = HttpContext.Session.GetString("Email");

            var user = _context.Users.FirstOrDefault(u => u.Email == currentUserEmail);

            if (user != null)
            {
                ViewBag.UserName = user.UserName;
            }

            return View();
        }

        // 根據用戶的角色或其他條件來導向後台
        public IActionResult RedirectToBackstage()
        {
            if (User.IsInRole("admin"))
            {
                return RedirectToAction("adminBackstage");
            }
            else if (User.IsInRole("vendor"))
            {
                return RedirectToAction("vendorBackstage");
            }

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            // 先從資料庫獲取資料
            var users = _context.Users.ToList();

            // 在 C# 轉換 Identity 數值為對應的角色名稱
            var userList = users.Select(u => new
            {
                Identity = ConvertIdentityToRole(u.Identity), // 轉換角色名稱
                UserId = u.UserId,
                Name = u.Name,
                UserName = u.UserName,
                Email = u.Email,
                GuiCode = u.GuiCode,
                CreatedAt = u.CreatedAt.ToString("yyyy-MM-dd") // 格式化日期
            }).ToList();

            return Json(userList);
        }

        // 將 Identity 數字轉換為角色名稱
        private string ConvertIdentityToRole(int identity)
        {
            return identity switch
            {
                1 => "使用者",
                2 => "廠商",
                3 => "管理員",
                _ => "未知角色"
            };
        }


        [HttpDelete]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == id);
            if (user == null)
            {
                return Json(new { success = false, message = "找不到該會員" });
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Json(new { success = true });
        }

        [HttpGet]
        public IActionResult GetProducts()
        {
            // 先從資料庫獲取資料
            var products = _context.Products.ToList();

            // 在 C# 轉換 Identity 數值為對應的角色名稱
            var productList = products.Select(p => new
            {
                ProductName = p.ProductName,
                Price = p.Price,
                Discount = p.Discount,
                Stock = p.Stock,
                Image01 = p.Image01,
                ReleaseDate = p.ReleaseDate.ToString("yyyy-MM-dd") // 格式化日期

            }).ToList();

            return Json(productList);
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            // 先從資料庫獲取資料
            var orderQuery = ( _context.Orders
                            .Join(_context.Users,
                             o => o.UserId,
                             u => u.UserId,
                             (o, u) => new { o, u })
                         .Join(_context.Products,
                             ou => ou.o.ProductId,
                             p => p.ProductId,
                             (ou, p) => new { ou.o, ou.u, p })
                         .Join(_context.DeliveryInfos,
                             oup => oup.o.DeliveryInfoId,
                             d => d.DeliveryInfoId,
                             (oup, d) => new
                             {
                                 oup.o.OrderId,
                                 oup.o.OrderNumber,
                                 oup.o.UserId,
                                 oup.u.Name,
                                 oup.p.ProductName,
                                 oup.o.Quantity,
                                 oup.o.Payment,
                                 d.Address
                             })).ToList();

            return Json(orderQuery);
        }

        [HttpGet]
        public IActionResult GetContact()
        {
            // 先從資料庫獲取資料
            var contacts = _context.Contacts.ToList();
            
            var contactList = contacts.Select(c => new
            {
                contactId = c.MessageId,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                Type = c.Type,
                Title = c.Title,
                Content = c.Content,
                Status=c.ReplyContent,

            }).ToList();

            return Json(contactList);
        }


        [HttpDelete]
        public IActionResult DeleteProduct(int id)
        {
            // 輸出 ID 來檢查
            Console.WriteLine($"Attempting to delete product with ID: {id}");

            try
            {
                // 先刪除 Order 表中與該商品關聯的所有訂單資料
                var orders = _context.Orders.Where(o => o.ProductId == id).ToList();
                if (orders.Any())
                {
                    _context.Orders.RemoveRange(orders);  // 使用 RemoveRange 來刪除多筆資料
                    _context.SaveChanges();  // 刪除訂單資料
                }

                // 再刪除 ProductCategoryMapping 表中與該商品關聯的資料
                var categoryMappings = _context.ProductCategoryMappings.Where(m => m.ProductId == id).ToList();
                if (categoryMappings.Any())
                {
                    _context.ProductCategoryMappings.RemoveRange(categoryMappings);  // 刪除商品與類別的關聯資料
                    _context.SaveChanges();  // 保存更改
                }

                // 然後刪除商品
                var product = _context.Products.FirstOrDefault(p => p.ProductId == id);
                if (product == null)
                {
                    return Json(new { success = false, message = "找不到該商品" });
                }

                // 刪除商品
                _context.Products.Remove(product);
                _context.SaveChanges();  // 保存刪除商品資料

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "刪除商品時發生錯誤: " + ex.Message });
            }
        }









    }
}
