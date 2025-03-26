using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SportMatch.Models;

public partial class SportMatchV1Context : DbContext
{
    public SportMatchV1Context()
    {
    }

    public SportMatchV1Context(DbContextOptions<SportMatchV1Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Apply> Applies { get; set; }

    public virtual DbSet<Area> Areas { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<DeliveryInfo> DeliveryInfos { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventGroup> EventGroups { get; set; }

    public virtual DbSet<Favorite> Favorites { get; set; }

    public virtual DbSet<Gender> Genders { get; set; }

    public virtual DbSet<JoinInformation> JoinInformations { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<ProductCategory> ProductCategories { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductCategoryMapping> ProductCategoryMappings { get; set; }

    public virtual DbSet<ProductSubCategory> ProductSubCategories { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Sport> Sports { get; set; }

    public virtual DbSet<SportsVenue> SportsVenues { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    public virtual DbSet<TeamMemberMapping> TeamMemberMappings { get; set; }

    public virtual DbSet<TeamRecruitment> TeamRecruitments { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserSportRole> UserSportRoles { get; set; }

    public virtual DbSet<VenueFee> VenueFees { get; set; }

    public virtual DbSet<VenueImage> VenueImages { get; set; }

    public virtual DbSet<VenueRent> VenueRents { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=SportMatchV1;Integrated Security=True;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Apply>(entity =>
        {
            entity.HasKey(e => e.ApplyId).HasName("PK__Apply__F0687F91AB5C9565");

            entity.ToTable("Apply");

            entity.HasIndex(e => e.ApplyId, "UQ__Apply__F0687F90CECF6714").IsUnique();

            entity.Property(e => e.ApplyId).HasColumnName("ApplyID");
            entity.Property(e => e.Memo).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(4);
            entity.Property(e => e.TeamId).HasColumnName("TeamID");
            entity.Property(e => e.Type).HasMaxLength(10);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Team).WithMany(p => p.Applies)
                .HasForeignKey(d => d.TeamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Apply__TeamID__123EB7A3");

            entity.HasOne(d => d.User).WithMany(p => p.Applies)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Apply__UserID__114A936A");
        });

        modelBuilder.Entity<Area>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK__Area__70B8202834816404");

            entity.ToTable("Area");

            entity.HasIndex(e => e.AreaId, "UQ__Area__70B82029A8CBFA12").IsUnique();

            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.AreaName).HasMaxLength(2);
        });

        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Contact__C87C037CF096594D");

            entity.ToTable("Contact");

            entity.HasIndex(e => e.MessageId, "UQ__Contact__C87C037DC1317432").IsUnique();

            entity.Property(e => e.MessageId).HasColumnName("MessageID");
            entity.Property(e => e.CreatedTime).HasColumnName("Created_time");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.ReplyBy).HasMaxLength(10);
            entity.Property(e => e.ReplyTime).HasColumnName("Reply_time");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.Type).HasMaxLength(50);
        });

        modelBuilder.Entity<DeliveryInfo>(entity =>
        {
            entity.ToTable("DeliveryInfo");

            entity.Property(e => e.DeliveryInfoId).HasColumnName("DeliveryInfoID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Recepient).HasMaxLength(10);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.DeliveryInfos)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DeliveryInfo_User");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.EventId).HasName("PK__Event__7944C870309667DB");

            entity.ToTable("Event");

            entity.HasIndex(e => e.EventId, "UQ__Event__7944C8712B348A98").IsUnique();

            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.EventGroupId).HasColumnName("EventGroupID");
            entity.Property(e => e.EventLocation).HasMaxLength(100);
            entity.Property(e => e.EventName).HasMaxLength(50);
            entity.Property(e => e.GenderId).HasColumnName("GenderID");
            entity.Property(e => e.SportId).HasColumnName("SportID");

            entity.HasOne(d => d.Area).WithMany(p => p.Events)
                .HasForeignKey(d => d.AreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Event__AreaID__05D8E0BE");

            entity.HasOne(d => d.EventGroup).WithMany(p => p.Events)
                .HasForeignKey(d => d.EventGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Event__EventGrou__03F0984C");

            entity.HasOne(d => d.Gender).WithMany(p => p.Events)
                .HasForeignKey(d => d.GenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Event__GenderID__01142BA1");

            entity.HasOne(d => d.Sport).WithMany(p => p.Events)
                .HasForeignKey(d => d.SportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Event__SportID__04E4BC85");
        });

        modelBuilder.Entity<EventGroup>(entity =>
        {
            entity.HasKey(e => e.EventGroupId).HasName("PK__EventGro__59A1D192768C57A4");

            entity.ToTable("EventGroup");

            entity.HasIndex(e => e.EventGroupId, "UQ__EventGro__59A1D19362509525").IsUnique();

            entity.Property(e => e.EventGroupId).HasColumnName("EventGroupID");
            entity.Property(e => e.EventGroupName).HasMaxLength(5);
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.ToTable("Favorite");

            entity.Property(e => e.FavoriteId).HasColumnName("FavoriteID");
            entity.Property(e => e.Type).HasMaxLength(5);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.MyFavoriteNavigation).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.MyFavorite)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Favorite_Event");

            entity.HasOne(d => d.MyFavorite1).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.MyFavorite)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Favorite_Product");

            entity.HasOne(d => d.MyFavorite2).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.MyFavorite)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Favorite_Team");

            entity.HasOne(d => d.MyFavorite3).WithMany(p => p.FavoriteMyFavorite3s)
                .HasForeignKey(d => d.MyFavorite)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Favorite_User1");

            entity.HasOne(d => d.MyFavorite4).WithMany(p => p.Favorites)
                .HasForeignKey(d => d.MyFavorite)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Favorite_SportsVenue");

            entity.HasOne(d => d.User).WithMany(p => p.FavoriteUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Favorite_User");
        });

        modelBuilder.Entity<Gender>(entity =>
        {
            entity.HasKey(e => e.GenderId).HasName("PK__Gender__4E24E81761C52B2F");

            entity.ToTable("Gender");

            entity.HasIndex(e => e.GenderId, "UQ__Gender__4E24E816992586C5").IsUnique();

            entity.Property(e => e.GenderId).HasColumnName("GenderID");
            entity.Property(e => e.GenderType).HasMaxLength(3);
        });

        modelBuilder.Entity<JoinInformation>(entity =>
        {
            entity.HasKey(e => e.JoinId).HasName("PK__JoinInfo__AD6AA8BA7DE78BC5");

            entity.ToTable("JoinInformation");

            entity.HasIndex(e => e.JoinId, "UQ__JoinInfo__AD6AA8BB6CDF6CE7").IsUnique();

            entity.Property(e => e.JoinId).HasColumnName("JoinID");
            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.TeamId).HasColumnName("TeamID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Event).WithMany(p => p.JoinInformations)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__JoinInfor__Event__00200768");

            entity.HasOne(d => d.Team).WithMany(p => p.JoinInformations)
                .HasForeignKey(d => d.TeamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__JoinInfor__TeamI__02FC7413");

            entity.HasOne(d => d.User).WithMany(p => p.JoinInformations)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__JoinInfor__UserI__02084FDA");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order__C3905BAF68225A66");

            entity.ToTable("Order");

            entity.HasIndex(e => e.OrderId, "UQ__Order__C3905BAE15A756E2").IsUnique();

            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.DeliveryInfoId).HasColumnName("DeliveryInfoID");
            entity.Property(e => e.OrderNumber).HasMaxLength(10);
            entity.Property(e => e.Payment).HasMaxLength(15);
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            //entity.HasOne(d => d.DeliveryInfo).WithMany(p => p.Orders)
            //    .HasForeignKey(d => d.DeliveryInfoId)
            //    .HasConstraintName("FK_Order_DeliveryInfo");

            entity.HasOne(d => d.Product).WithMany(p => p.Orders)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__ProductID__17036CC0");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__UserID__17F790F9");
        });

        modelBuilder.Entity<ProductCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__ProducCa__19093A2BBD40185B");

            entity.ToTable("ProductCategory");

            entity.HasIndex(e => e.CategoryId, "UQ__ProducCa__19093A2A52CAE684").IsUnique();

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(50);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__B40CC6EDF9915AAF");

            entity.ToTable("Product");

            entity.HasIndex(e => e.ProductId, "UQ__Product__B40CC6EC304CC451").IsUnique();

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ProductDetails).HasColumnType("text");
            entity.Property(e => e.ProductName).HasMaxLength(255);
        });

        modelBuilder.Entity<ProductCategoryMapping>(entity =>
        {
            entity.HasKey(e => e.MappingKeyId);

            entity.ToTable("ProductCategoryMapping");

            entity.HasIndex(e => e.ProductId, "UQ__ProductC__B40CC6EC5DE0780D").IsUnique();

            entity.Property(e => e.MappingKeyId).HasColumnName("MappingKeyID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.SubCategoryId).HasColumnName("SubCategoryID");

            entity.HasOne(d => d.Category).WithMany(p => p.ProductCategoryMappings)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCa__Categ__160F4887");

            entity.HasOne(d => d.Product).WithOne(p => p.ProductCategoryMapping)
                .HasForeignKey<ProductCategoryMapping>(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductCa__Produ__151B244E");

            entity.HasOne(d => d.SubCategory).WithMany(p => p.ProductCategoryMappings)
                .HasForeignKey(d => d.SubCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductCategoryMapping_ProductSubCategory");
        });

        modelBuilder.Entity<ProductSubCategory>(entity =>
        {
            entity.HasKey(e => e.SubCategoryId).HasName("PK_Table_1");

            entity.ToTable("ProductSubCategory");

            entity.Property(e => e.SubCategoryId)
                .ValueGeneratedNever()
                .HasColumnName("SubCategoryID");
            entity.Property(e => e.SubCategoryName)
                .HasMaxLength(50)
                .IsFixedLength();
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE3AE450BA8A");

            entity.ToTable("Role");

            entity.HasIndex(e => e.RoleId, "UQ__Role__8AFACE3B57514FB5").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName).HasMaxLength(10);
            entity.Property(e => e.SportId).HasColumnName("SportID");

            entity.HasOne(d => d.Sport).WithMany(p => p.Roles)
                .HasForeignKey(d => d.SportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Role__SportID__0C85DE4D");
        });

        modelBuilder.Entity<Sport>(entity =>
        {
            entity.HasKey(e => e.SportId).HasName("PK__Sport__7A41AF1C5AB3F89E");

            entity.ToTable("Sport");

            entity.HasIndex(e => e.SportId, "UQ__Sport__7A41AF1D0C28EC97").IsUnique();

            entity.Property(e => e.SportId).HasColumnName("SportID");
            entity.Property(e => e.SportName).HasMaxLength(40);
        });

        modelBuilder.Entity<SportsVenue>(entity =>
        {
            entity.HasKey(e => e.VenueId).HasName("PK__SportsVe__3C57E5D281A1872B");

            entity.ToTable("SportsVenue");

            entity.HasIndex(e => e.VenueId, "UQ__SportsVe__3C57E5D3DAB9A85F").IsUnique();

            entity.Property(e => e.VenueId).HasColumnName("VenueID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.ContactLineId)
                .HasMaxLength(255)
                .HasColumnName("ContactLineID");
            entity.Property(e => e.Description).HasMaxLength(100);
            entity.Property(e => e.Facilities).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(255);
            entity.Property(e => e.SportId).HasColumnName("SportID");
            entity.Property(e => e.VenueName).HasMaxLength(100);

            entity.HasOne(d => d.Sport).WithMany(p => p.SportsVenues)
                .HasForeignKey(d => d.SportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SportsVen__Sport__1332DBDC");
        });

        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(e => e.TeamId).HasName("PK__Team__123AE7B9A92ABD72");

            entity.ToTable("Team");

            entity.HasIndex(e => e.TeamId, "UQ__Team__123AE7B8D0904A47").IsUnique();

            entity.HasIndex(e => e.TeamName, "UQ__Team__4E21CAACEBAB3BCB").IsUnique();

            entity.Property(e => e.TeamId).HasColumnName("TeamID");
            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.EventId).HasColumnName("EventID");
            entity.Property(e => e.GenderId).HasColumnName("GenderID");
            entity.Property(e => e.SportId).HasColumnName("SportID");
            entity.Property(e => e.TeamMemo).HasMaxLength(100);
            entity.Property(e => e.TeamName).HasMaxLength(20);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Area).WithMany(p => p.Teams)
                .HasForeignKey(d => d.AreaId)
                .HasConstraintName("FK__Team__AreaID__0A9D95DB");

            entity.HasOne(d => d.Event).WithMany(p => p.Teams)
                .HasForeignKey(d => d.EventId)
                .HasConstraintName("FK__Team__EventID__0B91BA14");

            entity.HasOne(d => d.Gender).WithMany(p => p.Teams)
                .HasForeignKey(d => d.GenderId)
                .HasConstraintName("FK__Team__GenderID__09A971A2");

            entity.HasOne(d => d.Sport).WithMany(p => p.Teams)
                .HasForeignKey(d => d.SportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Team__SportID__06CD04F7");

            entity.HasOne(d => d.User).WithMany(p => p.Teams)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Team__UserID__07C12930");
        });

        modelBuilder.Entity<TeamMemberMapping>(entity =>
        {
            entity.HasKey(e => e.MappingId).HasName("PK__TeamMemb__8B5781BD1A03B6E3");

            entity.ToTable("TeamMemberMapping");

            entity.HasIndex(e => e.MappingId, "UQ__TeamMemb__8B5781BC3C8A989A").IsUnique();

            entity.Property(e => e.MappingId).HasColumnName("MappingID");
            entity.Property(e => e.SportId).HasColumnName("SportID");
            entity.Property(e => e.TeamIdLeader).HasColumnName("TeamID_Leader");
            entity.Property(e => e.TeamIdMember).HasColumnName("TeamID_Member");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Sport).WithMany(p => p.TeamMemberMappings)
                .HasForeignKey(d => d.SportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TeamMembe__Sport__0E6E26BF");

            entity.HasOne(d => d.TeamIdLeaderNavigation).WithMany(p => p.TeamMemberMappingTeamIdLeaderNavigations)
                .HasForeignKey(d => d.TeamIdLeader)
                .HasConstraintName("FK__TeamMembe__TeamI__0F624AF8");

            entity.HasOne(d => d.TeamIdMemberNavigation).WithMany(p => p.TeamMemberMappingTeamIdMemberNavigations)
                .HasForeignKey(d => d.TeamIdMember)
                .HasConstraintName("FK__TeamMembe__TeamI__10566F31");

            entity.HasOne(d => d.User).WithMany(p => p.TeamMemberMappings)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TeamMembe__UserI__0D7A0286");
        });

        modelBuilder.Entity<TeamRecruitment>(entity =>
        {
            entity.HasKey(e => e.TeamHireId).HasName("PK_TeamHire");

            entity.ToTable("TeamRecruitment");

            entity.Property(e => e.TeamHireId).HasColumnName("TeamHireID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.TeamId).HasColumnName("TeamID");

            entity.HasOne(d => d.Role).WithMany(p => p.TeamRecruitments)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TeamHire_Role");

            entity.HasOne(d => d.Team).WithMany(p => p.TeamRecruitments)
                .HasForeignKey(d => d.TeamId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TeamHire_Team");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CCAC2E756AF1");

            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "UQ__User__A9D105348FB74F68").IsUnique();

            entity.HasIndex(e => e.UserName, "UQ__User__B0C3AC46776F1030").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID ");
            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.CreatedAt).HasColumnName("Created_at");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.GenderId).HasColumnName("GenderID");
            entity.Property(e => e.Invited)
                .HasMaxLength(2)
                .HasDefaultValue("Y");
            entity.Property(e => e.Mobile).HasMaxLength(15);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.UserMemo).HasMaxLength(255);
            entity.Property(e => e.UserName).HasMaxLength(50);

            entity.HasOne(d => d.Area).WithMany(p => p.Users)
                .HasForeignKey(d => d.AreaId)
                .HasConstraintName("FK__User__AreaID__1AD3FDA4");

            entity.HasOne(d => d.Gender).WithMany(p => p.Users)
                .HasForeignKey(d => d.GenderId)
                .HasConstraintName("FK__User__GenderID__1BC821DD");
        });

        modelBuilder.Entity<UserSportRole>(entity =>
        {
            entity.HasKey(e => e.Usrid);

            entity.ToTable("UserSportRole");

            entity.Property(e => e.Usrid).HasColumnName("USRID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.SportId).HasColumnName("SportID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Role).WithMany(p => p.UserSportRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserSportRole_Role");

            entity.HasOne(d => d.Sport).WithMany(p => p.UserSportRoles)
                .HasForeignKey(d => d.SportId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserSportRole_Sport");

            entity.HasOne(d => d.User).WithMany(p => p.UserSportRoles)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserSportRole_User");
        });

        modelBuilder.Entity<VenueFee>(entity =>
        {
            entity.ToTable("VenueFee");

            entity.Property(e => e.VenueFeeId)
                .ValueGeneratedNever()
                .HasColumnName("VenueFeeID");
            entity.Property(e => e.OpenTime).HasMaxLength(20);
            entity.Property(e => e.VenueArea).HasMaxLength(50);
            entity.Property(e => e.VenueFee1).HasColumnName("VenueFee");
            entity.Property(e => e.VenueId).HasColumnName("VenueID");

            entity.HasOne(d => d.Venue).WithMany(p => p.VenueFees)
                .HasForeignKey(d => d.VenueId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VenueFee_SportsVenue");
        });

        modelBuilder.Entity<VenueImage>(entity =>
        {
            entity.HasKey(e => e.PicId).HasName("PK__VenueIma__B04A93E1235ACC27");

            entity.ToTable("VenueImage");

            entity.HasIndex(e => e.PicId, "UQ__VenueIma__B04A93E0FAEBBF5C").IsUnique();

            entity.Property(e => e.PicId).HasColumnName("PicID");
            entity.Property(e => e.Image).HasMaxLength(255);
            entity.Property(e => e.VenueId).HasColumnName("VenueID");

            entity.HasOne(d => d.Venue).WithMany(p => p.VenueImages)
                .HasForeignKey(d => d.VenueId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VenueImag__Venue__14270015");
        });

        modelBuilder.Entity<VenueRent>(entity =>
        {
            entity.HasKey(e => e.RentId);

            entity.ToTable("VenueRent");

            entity.Property(e => e.RentId).HasColumnName("RentID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.VenueFeeId).HasColumnName("VenueFeeID");

            entity.HasOne(d => d.User).WithMany(p => p.VenueRents)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VenueRent_User");

            entity.HasOne(d => d.VenueFee).WithMany(p => p.VenueRents)
                .HasForeignKey(d => d.VenueFeeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VenueRent_VenueFee");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
