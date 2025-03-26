using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SportMatch.Models;

public partial class SportMatchContext : DbContext
{
    public SportMatchContext()
    {
    }

    public SportMatchContext(DbContextOptions<SportMatchContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Apply> Applies { get; set; }

    public virtual DbSet<Area> Areas { get; set; }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<EventGroup> EventGroups { get; set; }

    public virtual DbSet<Gender> Genders { get; set; }

    public virtual DbSet<JoinInformation> JoinInformations { get; set; }

    public virtual DbSet<Order> Orders { get; set; }


    //250314新增↓

    public virtual DbSet<Product> Product { get; set; }

    public virtual DbSet<ProductCategory> ProductCategory { get; set; }

    public virtual DbSet<ProductCategoryMapping> ProductCategoryMapping { get; set; }

    public virtual DbSet<ProductSubCategory> ProductSubCategory { get; set; }


    //250325新增↓
    public virtual DbSet<Favorite> Favorite { get; set; }

    public virtual DbSet<DeliveryInfo> DeliveryInfo { get; set; }


    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Sport> Sports { get; set; }

    public virtual DbSet<SportsVenue> SportsVenues { get; set; }

    public virtual DbSet<Team> Teams { get; set; }

    public virtual DbSet<TeamMemberMapping> TeamMemberMappings { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VenueImage> VenueImages { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        // 250314註解
        => optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=SportMatch;Trusted_Connection=True;TrustServerCertificate=True;");

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
            entity.HasKey(e => e.JoinId).HasName("PK__JoinInfo__AD6AA8BA62B32999");

            entity.ToTable("JoinInformation");

            entity.HasIndex(e => e.JoinId, "UQ__JoinInfo__AD6AA8BBC9D66898").IsUnique();

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
            entity.Property(e => e.OrderNumber).HasMaxLength(10);
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            //entity.HasOne(d => d.Product).WithMany(p => p.Orders)
            //    .HasForeignKey(d => d.ProductId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__Order__ProductID__17036CC0");

            //entity.HasOne(d => d.User).WithMany(p => p.Orders)
            //    .HasForeignKey(d => d.UserId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__Order__UserID__17F790F9");
        });
                    //250314ProducCategory改為ProductCategory
        modelBuilder.Entity<ProductCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryID).HasName("PK__ProducCa__19093A2BBD40185B");

                    //250314ProducCategory改為ProductCategory
            entity.ToTable("ProductCategory"); 

            entity.HasIndex(e => e.CategoryID, "UQ__ProducCa__19093A2A52CAE684").IsUnique();

            entity.Property(e => e.CategoryID).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(50);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductID).HasName("PK__Product__B40CC6EDF9915AAF");

            entity.ToTable("Product");

            entity.HasIndex(e => e.ProductID, "UQ__Product__B40CC6EC304CC451").IsUnique();

            entity.Property(e => e.ProductID).HasColumnName("ProductID");
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ProductDetails).HasColumnType("text");
            entity.Property(e => e.Name).HasMaxLength(255);
        });                //250314ProductName改為Name

        modelBuilder.Entity<ProductCategoryMapping>(entity =>
        {
            entity.HasKey(e => new { e.ProductID, e.CategoryID }).HasName("PK__ProductC__159C554F8AD469C6");

            entity.ToTable("ProductCategoryMapping");

            entity.HasIndex(e => e.ProductID, "UQ__ProductC__B40CC6EC14175B09").IsUnique();

            entity.Property(e => e.ProductID)
                .ValueGeneratedOnAdd()
                .HasColumnName("ProductID");
            entity.Property(e => e.CategoryID).HasColumnName("CategoryID");
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
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
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

            entity.HasOne(d => d.Role).WithMany(p => p.Teams)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__Team__RoleID__08B54D69");

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
            entity.HasKey(e => e.MappingId).HasName("PK__TeamMemb__8B5781BDCDC31BEE");

            entity.ToTable("TeamMemberMapping");

            entity.HasIndex(e => e.MappingId, "UQ__TeamMemb__8B5781BCDA20CC23").IsUnique();

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

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CCAC2E756AF1");

            entity.ToTable("User");

            entity.HasIndex(e => e.UserId, "UQ__User__1788CCADA0E717EC").IsUnique();

            entity.HasIndex(e => e.Mobile, "UQ__User__6FAE078273866F77").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__User__A9D105348FB74F68").IsUnique();

            entity.HasIndex(e => e.UserName, "UQ__User__B0C3AC46776F1030").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID ");
            entity.Property(e => e.AreaId).HasColumnName("AreaID");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.GenderId).HasColumnName("GenderID");
            entity.Property(e => e.Invited)
                .HasMaxLength(2)
                .HasDefaultValue("Y")
                .HasColumnName("invited");
            entity.Property(e => e.Mobile).HasMaxLength(15);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.SportId).HasColumnName("SportID");
            entity.Property(e => e.UserMemo).HasMaxLength(255);
            entity.Property(e => e.UserName).HasMaxLength(50);

            entity.HasOne(d => d.Area).WithMany(p => p.Users)
                .HasForeignKey(d => d.AreaId)
                .HasConstraintName("FK__User__AreaID__1AD3FDA4");

            entity.HasOne(d => d.Gender).WithMany(p => p.Users)
                .HasForeignKey(d => d.GenderId)
                .HasConstraintName("FK__User__GenderID__1BC821DD");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__User__RoleID__19DFD96B");

            entity.HasOne(d => d.Sport).WithMany(p => p.Users)
                .HasForeignKey(d => d.SportId)
                .HasConstraintName("FK__User__SportID__18EBB532");
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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
