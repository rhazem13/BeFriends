using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IFollowsRepository
    {
        Task<UserFollow> GetUserFollow(int sourceUserId, int followedUserId);
        void RemoveUserFollow(UserFollow userFollow);
        Task<AppUser> GetUserWithFollows(int userId);
        Task<PagedList<FollowDto>> GetUserFollows(FollowsParams followsParams);
    }
}
