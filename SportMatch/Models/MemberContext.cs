using Microsoft.EntityFrameworkCore;

namespace SportMatch.Models
{
   

    public class UserContext : DbContext  // 改為 UserContext，與資料表名稱一致
    {
        public UserContext(DbContextOptions<UserContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }  // Users 資料表

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 若要顯式設定主鍵（如果不使用預設的命名規則）
            modelBuilder.Entity<User>().HasKey(m => m.UID);
        }
    }
}
