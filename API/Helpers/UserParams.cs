namespace API.Helpers
{
    public class UserParams : PaginationParams
    {
        public string Search { get; set; }=string.Empty;
        public string CurrentUsername { get; set; }=string.Empty;
        public string OrderBy { get; set; } = "lastActive";
    }
}
