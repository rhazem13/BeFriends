namespace API.Entities
{
    public class UserPostLike
    {
        public int PostId { get; set; }
        public Post Post { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }

    }
}
