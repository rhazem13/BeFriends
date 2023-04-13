using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace API.Data
{
    public class PostsRepository : IPostsRepository
    {
        private readonly DataContext context;

        public PostsRepository(DataContext context)
        {
            this.context = context;
        }

        public Comment CreateComment(CreateCommentDto createCommentDto, int userId)
        {
            Comment comment = new Comment
            {
                Text = createCommentDto.Text,
                PostId = createCommentDto.PostId,
                UserId = userId
            };
            this.context.Add(comment);
            return comment;
        }

        public Post CreatePostAsync(CreatePostDto createPostDto, int PosterId, string PosterUserName)
        {
            Post post = new Post
            {
                PosterId = PosterId,
                PosterUsername = PosterUserName,
                Content = createPostDto.Content,
                ContentImageUrl = createPostDto.ContentImageUrl,
                Posted = DateTime.UtcNow
            };
            context.Posts.AddAsync(post);
            return post;
        }

        public Post? GetPostById(int id)
        {
            return context.Posts.Include(p => p.UserPostLikes).ThenInclude(u => u.User).FirstOrDefault(u => u.Id == id);
        }

        public async Task<List<Post>> GetPostsAsync(int userId)
        {
            return await this.context.Posts
                .Join(context.Follows,
                post=>post.PosterId,
                follow=>follow.FollowedUserId,
                (post,follow)=>new {Post=post, Follow=follow})
                .Where(joinResult=>joinResult.Follow.SourceUserId== userId)
                .Select(joinResult=>joinResult.Post)
                .OrderByDescending(r=>r.Posted)
                .Include(p=>p.Poster)
                .ThenInclude(p=>p.Photos)
                .Include(p=>p.UserPostLikes)
                .Include(p=>p.Comments)
                .ToListAsync();
        }

        public async Task<List<Post>> GetUserPostsAsync(string username, int userId)
        {
            return await this.context.Posts
                .Where(post=>post.PosterUsername==username)
                .OrderByDescending(r=>r.Posted)
                .Include(p=>p.Poster)
                .ThenInclude(p=>p.Photos)
                .Include(p=>p.UserPostLikes)
                .Include(p=>p.Comments)
                .ToListAsync();
        }

        public void LikePost(Post post, int userId)
        {
            UserPostLike userPostLike = new UserPostLike
            {
                UserId = userId,
                PostId = post.Id
            };
            if (post.UserPostLikes != null)
            {
                post.UserPostLikes.Add(userPostLike);
            }
            else
            {

                post.UserPostLikes = new List<UserPostLike>();
                post.UserPostLikes.Add(userPostLike);
            }
        }

        public void UnLikePost(Post post, int userId)
        {
            if (post.UserPostLikes != null)
            {
                var userPostLike=post.UserPostLikes.Where(post=> post.UserId == userId).FirstOrDefault();
                post.UserPostLikes.Remove(userPostLike);
            }
        }

        
    }
}
