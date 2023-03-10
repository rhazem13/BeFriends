namespace API.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public int PosterId { get; set; }
        public AppUser Poster { get; set; }
        public string Content { get; set; }
        public string? ContentImageUrl { get; set; }
        public DateTime Posted { get; set; } = DateTime.UtcNow;
        public ICollection<UserPostLike> UserPostLikes { get; set; }
        public ICollection<Comment> Comments { get; set; }



    }
}
