﻿namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        IFollowsRepository FollowsRepository { get; }
        IPostsRepository PostsRepository { get; }
        Task<bool> Complete();
        bool HasChanges();
    }
}
