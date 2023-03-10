using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.ComponentModel;
using System.Reflection.Emit;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole,IdentityUserLogin<int>, IdentityRoleClaim<int>
        ,IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            configurationBuilder.Properties<DateOnly>()
               .HaveConversion<DateOnlyConverter>()
               .HaveColumnType("date");
        }

        public DbSet<UserFollow> Follows { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<UserPostLike> UserPostsLikes { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();
            builder.Entity<UserFollow>()
                .HasKey(k => new { k.SourceUserId, k.FollowedUserId });
            builder.Entity<UserFollow>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.FollowedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<UserFollow>()
                .HasOne(s => s.FollowedUser)
                .WithMany(l => l.FollowedByUsers)
                .HasForeignKey(s => s.FollowedUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesRecieved)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u=>u.Sender)
                .WithMany(m=>m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserPostLike>()
                .HasKey(like=> new {like.PostId, like.UserId});
            builder.Entity<UserPostLike>()
            .HasOne(like => like.Post)
            .WithMany(post => post.UserPostLikes)
            .HasForeignKey(like => like.PostId);

            builder.Entity<UserPostLike>()
                .HasOne(like => like.User)
                .WithMany(user => user.UserPostLikes)
                .HasForeignKey(like => like.UserId);

            builder.Entity<Post>()
            .HasMany(post => post.Comments)
            .WithOne(comment => comment.Post)
            .HasForeignKey(comment => comment.PostId);

            builder.Entity<Comment>()
            .HasOne(comment => comment.User)
            .WithMany(user => user.Comments)
            .HasForeignKey(comment => comment.UserId);
        }
    }
}
public class DateOnlyConverter : ValueConverter<DateOnly, DateTime>
{
    /// <summary>
    /// Creates a new instance of this converter.
    /// </summary>
    public DateOnlyConverter() : base(
            d => d.ToDateTime(TimeOnly.MinValue),
            d => DateOnly.FromDateTime(d))
    { }
}