﻿using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<MemberDto> GetMemberAsync(string username, int curUserId)
        {
            var user= await context.Users.AsNoTracking()
                .Where(u => u.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
            user.Followed = (context.Follows.Any(f => f.SourceUserId == curUserId && f.FollowedUserId == user.Id));
            return user;
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams, int curUserId)
        {
            var query = context.Users
               .AsQueryable();
            query = query.Where(u => u.UserName != userParams.CurrentUsername && u.UserName != "admin" )
            .Where(u=>u.KnownAs.Contains(userParams.Search)||u.UserName.Contains(userParams.Search));
            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };
            var users = await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider).AsNoTracking(), userParams.PageNumber, userParams.PageSize);
            users.ForEach(u => u.Followed = (context.Follows.Any(f => f.SourceUserId == curUserId && f.FollowedUserId == u.Id)));
            return users;
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await context.Users.Include(p => p.Photos).SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await context.Users.Include(p=>p.Photos).ToListAsync();
        }

        public void Update(AppUser user)
        {
            context.Entry(user).State=EntityState.Modified;
        }
    }
}
