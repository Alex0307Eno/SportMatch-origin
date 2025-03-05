using System.Composition;
using Microsoft.AspNetCore.Mvc;
using static SportMatch.Controllers.DoorController;
using Azure;
using static SportMatch.Controllers.MartController;

namespace SportMatch.Controllers
{
    public class MartController : Controller
    {
        public class Product
        {
            public int ProductID { get; set; }
            public string Name { get; set; }
            public int Price { get; set; }
            public int Discount { get; set; }
            public int Stock { get; set; }
            public string Image { get; set; }
            public bool MyHeart { get; set; }

        }

        public class Category
        {
            public int CategoryID { get; set; }
            public string ParentCategory { get; set; }
            public string ChildCategory1 { get; set; }
            public string ChildCategory2 { get; set; }
            public string ChildCategoryID1 { get; set; }
            public string ChildCategoryID2 { get; set; }
        }

        public IActionResult Mart()
        {
            //var _Products = new List<Product>
            //{
            //    new Product {ProductID =0, Name = "商品 1", Price = 199, Discount = -20, Stock = 8, Image = "/image/icon.jpg", MyHeart = false},
            //    new Product {ProductID =1, Name = "商品 2", Price = 299, Discount = -10, Stock = 1, Image = "/image/icon.jpg", MyHeart = false},
            //    new Product {ProductID =2, Name = "商品 3", Price = 399, Discount =  -5, Stock = 0, Image = "/image/icon.jpg", MyHeart = false},
            //    new Product {ProductID =3, Name = "商品 4", Price = 499, Discount =   0, Stock = 6, Image = "/image/icon.jpg", MyHeart = false},
            //    new Product {ProductID =4, Name = "商品 5", Price = 199, Discount = -20, Stock = 0, Image = "/image/icon.jpg", MyHeart = true},
            //    new Product {ProductID =5, Name = "商品 6", Price = 299, Discount = -10, Stock = 8, Image = "/image/icon.jpg", MyHeart = false},
            //    new Product {ProductID =6, Name = "商品 7", Price = 399, Discount =  -5, Stock = 4, Image = "/image/icon.jpg", MyHeart = false},
            //    new Product {ProductID =7, Name = "商品 8", Price = 499, Discount =   0, Stock = 0, Image = "/image/icon.jpg", MyHeart = false}
            //};
            //ViewBag.ForProducts = _Products;

            List<Category> _Category = new List<Category>
            {
                new Category { CategoryID = 1, ParentCategory = "羽毛球", ChildCategoryID1 = "ChildCategory1", ChildCategoryID2 = "ChildCategory2", ChildCategory1 = "球具", ChildCategory2 = "護具" },
                new Category { CategoryID = 2, ParentCategory = "籃球", ChildCategoryID1 = "ChildCategory3", ChildCategoryID2 = "ChildCategory4", ChildCategory1 = "球具", ChildCategory2 = "護具" },
                new Category { CategoryID = 3, ParentCategory = "排球", ChildCategoryID1 = "ChildCategory5", ChildCategoryID2 = "ChildCategory6", ChildCategory1 = "球具", ChildCategory2 = "護具" }
            };
            ViewBag.ForCategory = _Category;
            return View();
        }

        public IActionResult Checkout()
        {
            return View();
        }

        public IActionResult Bill()
        {
            List<Product> _Products = new List<Product>
            {
                new Product { Name = "商品 1", Price = 199, Discount = -20, Image = "/image/icon.jpg" },
                new Product { Name = "商品 2", Price = 299, Discount = -10, Image = "/image/icon.jpg" },
                new Product { Name = "商品 3", Price = 399, Discount = -5, Image = "/image/icon.jpg" },
                new Product { Name = "商品 4", Price = 499, Discount = 0, Image = "/image/icon.jpg" },
            };
            ViewBag.ForProducts = _Products;

            return View();
        }
    }
}
