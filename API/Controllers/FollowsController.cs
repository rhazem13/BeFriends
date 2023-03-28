using API.Data;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class FollowsController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly DataContext context;

        public FollowsController(IUnitOfWork unitOfWork, DataContext context)
        {
            this.unitOfWork = unitOfWork;
            this.context = context;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddFollow(string username)
        {
            var sourceUserId = User.GetUserId();
            var followedUser= await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await unitOfWork.FollowsRepository.GetUserWithFollows(sourceUserId);
            if (followedUser == null) return NotFound();
            if (sourceUser.UserName == username) return BadRequest("You cannot follow yourself!");
            var userFollow = await unitOfWork.FollowsRepository.GetUserFollow(sourceUserId, followedUser.Id);
            if (userFollow != null) return BadRequest("you already follow this user");
            userFollow = new Entities.UserFollow
            {
                SourceUserId = sourceUserId,
                FollowedUserId = followedUser.Id,
            };
            sourceUser.FollowedUsers.Add(userFollow);
            if (await unitOfWork.Complete()) return Ok();
            return BadRequest("failed to follow user");
        }

        [HttpDelete("{username}")]
        public async Task<ActionResult> RemoveFollow(string username)
        {
            var sourceUserId = User.GetUserId();
            var followedUser = await unitOfWork.UserRepository.GetUserByUsernameAsync(username.ToLower());
            var sourceUser = await unitOfWork.FollowsRepository.GetUserWithFollows(sourceUserId);
            if (followedUser == null) return NotFound();
            if (sourceUser.UserName == username) return BadRequest("You cannot Unfollow yourself!");
            var userFollow = await unitOfWork.FollowsRepository.GetUserFollow(sourceUserId, followedUser.Id);
            if (userFollow == null) return BadRequest("you already not following this user");
            unitOfWork.FollowsRepository.RemoveUserFollow(userFollow);
            if (await unitOfWork.Complete()) return Ok();
            return BadRequest("failed to unfollow user");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FollowDto>>> GetUserFollows([FromQuery]FollowsParams followsParams)
        {
            followsParams.UserId = User.GetUserId();
            var users =  await unitOfWork.FollowsRepository.GetUserFollows(followsParams);
            if (followsParams.Predicate == "followed")
            {
                users.ForEach(u => u.Followed = true);
            }
            else
            {
                users.ForEach(u => u.Followed = (context.Follows.Any(f => f.SourceUserId == User.GetUserId() && f.FollowedUserId == u.Id)));
            }

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }
    }
}
