using API.Entities;

namespace API.DTOs
{
    public class GetPostDto
    {
        public int Id { get; set; }
        public string PosterUserName { get; set; }
        public string PosterKnownAs { get; set; }
        public string PosterPhotoUrl { get; set; }
        public string Content { get; set; }
        public string? ContentImageUrl { get; set; }
        public DateTime? Posted { get; set; } 
        public int Likes { get; set; }
        public int Comments { get; set; }
    }
}
