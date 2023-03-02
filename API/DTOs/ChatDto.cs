namespace API.DTOs
{
    public class ChatDto
    {
        public int SenderId { get; set; }
        public string SenderUsername { get; set; }
        public string SenderPhotoUrl { get; set; }
        public string RecipientPhotoUrl { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime? MessageSent { get; set; }
        public string RecipientUsername { get; set; }

        public string ContactUsername { get; set; } = string.Empty;
        public string ContactPhotoUrl { get; set;} = string.Empty;
    }
}
