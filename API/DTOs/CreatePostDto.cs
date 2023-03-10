using API.Entities;

namespace API.DTOs
{
    public class CreatePostDto
    {
        public string Content { get; set; }
        public string? ContentImageUrl { get; set; }
    }
}
