using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class PostController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public PostController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<List<GetPostDto>> GetPostsAsync()
        {
            int userId = User.GetUserId();
            var result =  await unitOfWork.PostsRepository.GetPostsAsync(userId);
            return mapper.Map<List<GetPostDto>>(result);
        }

        [HttpPost]
        public ActionResult<Post> CreatePostAsync(CreatePostDto createPostDto)
        {
            int userId = User.GetUserId();
            string posterUsername = User.GetUsername();
            var result =  unitOfWork.PostsRepository.CreatePostAsync(createPostDto, userId,posterUsername);
            if(unitOfWork.Complete().Result)
                return Ok(result);
            return BadRequest(result);
        }

        [HttpPost("like")]
        public ActionResult LikePost(int postId)
        {
            int userId = User.GetUserId();
            Post post = unitOfWork.PostsRepository.GetPostById(postId);
            if(post==null)
                return NotFound();
            unitOfWork.PostsRepository.LikePost(post,userId);
            if (unitOfWork.Complete().Result)
                return Ok();
            return BadRequest();
        }
        [HttpPost("unlike")]
        public ActionResult UnLikePost(int postId)
        {
            int userId = User.GetUserId();
            Post post = unitOfWork.PostsRepository.GetPostById(postId);
            if (post == null)
                return NotFound();
            unitOfWork.PostsRepository.UnLikePost(post, userId);
            if (unitOfWork.Complete().Result)
                return Ok();
            return BadRequest();
        }

        [HttpPost("comment")]
        public ActionResult CommentPost(CreateCommentDto createCommentDto) {
            int userId = User.GetUserId();
            unitOfWork.PostsRepository.CreateComment(createCommentDto,userId);
            if (unitOfWork.Complete().Result)
                return Ok();
            return BadRequest();
        }
    }
}
