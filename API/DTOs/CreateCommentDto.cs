using API.Entities;

namespace API.DTOs
{
    public class CreateCommentDto
    {
        public string Text { get; set; }
        public int PostId { get; set; }
    }
}
