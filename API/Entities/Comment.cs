 namespace API.Entities
{
    public class Comment
    {
        public int CommentId { get; set; }
        public string Text { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }
    }
}
