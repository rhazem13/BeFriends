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
        private readonly IUserRepository userRepository;
        private readonly IFollowsRepository followsRepository;

        public FollowsController(IUserRepository userRepository, IFollowsRepository followsRepository)
        {
            this.userRepository = userRepository;
            this.followsRepository = followsRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddFollow(string username)
        {
            var sourceUserId = User.GetUserId();
            var followedUser= await userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await followsRepository.GetUserWithFollows(sourceUserId);
            if (followedUser == null) return NotFound();
            if (sourceUser.UserName == username) return BadRequest("You cannot follow yourself!");
            var userFollow = await followsRepository.GetUserFollow(sourceUserId, followedUser.Id);
            if (userFollow != null) return BadRequest("you already follow this user");
            userFollow = new Entities.UserFollow
            {
                SourceUserId = sourceUserId,
                FollowedUserId = followedUser.Id,
            };
            sourceUser.FollowedUsers.Add(userFollow);
            if (await userRepository.SaveAllAsync()) return Ok();
            return BadRequest("failed to follow user");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FollowDto>>> GetUserFollows([FromQuery]FollowsParams followsParams)
        {
            followsParams.UserId = User.GetUserId();
            var users =  await followsRepository.GetUserFollows(followsParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }
    }
}
