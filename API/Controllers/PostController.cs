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
        private readonly IPhotoService photoService;

        public PostController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.photoService = photoService;
        }

        [HttpGet]
        public async Task<List<GetPostDto>> GetPostsAsync()
        {
            int userId = User.GetUserId();
            var result =  await unitOfWork.PostsRepository.GetPostsAsync(userId);
            return mapper.Map<List<GetPostDto>>(result);
        }

        [HttpPost]
        public async Task<ActionResult<Post>> CreatePostAsync( [FromForm] string content, [FromForm] IFormFile image = null)
        {
            int userId = User.GetUserId();
            string posterUsername = User.GetUsername();
            var createPostDto = new CreatePostDto();
            createPostDto.Content = content;
            if(image!= null)
            {
                var imgresult = await photoService.AddPhotoAsync(image);
                if (imgresult.Error != null) return BadRequest(imgresult.Error.Message);
                createPostDto.ContentImageUrl = imgresult.SecureUrl.AbsoluteUri;
            }
            var result = unitOfWork.PostsRepository.CreatePostAsync(createPostDto, userId, posterUsername);
            if (unitOfWork.Complete().Result)
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
