using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IPostsRepository
    {
        public Task<List<Post>> GetPostsAsync(int userId);
        public Post CreatePostAsync(CreatePostDto post,int PosterId, string PosterUserName);
        public void LikePost(Post post, int userId);
        public void UnLikePost(Post post, int userId);
        public Post? GetPostById(int id);
        public Comment CreateComment(CreateCommentDto createCommentDto,int userId);
    }
}
