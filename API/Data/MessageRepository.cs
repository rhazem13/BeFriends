﻿using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await context.Groups
                .Include(c => c.Connections)
                .Where(c => c.Connections.Any(x => x.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await context.Messages.Include(u=>u.Sender).Include(u=>u.Recipient).SingleOrDefaultAsync(x=>x.Id==id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await context.Groups
                .Include(g => g.Connections)
                .FirstOrDefaultAsync(g => g.Name == groupName);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.Messages.OrderByDescending(m => m.MessageSent)
                .AsQueryable();
            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.Recipient.UserName == messageParams.Username && u.RecipientDeleted==false),
                "Outbox" => query.Where(u => u.Sender.UserName == messageParams.Username && u.SenderDeleted==false),
                _ => query.Where(u => u.Recipient.UserName == messageParams.Username && u.RecipientDeleted==false && u.DateRead == null)
            };
            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber,messageParams.PageSize);
        }

        public async Task<List<ChatDto>> GetChatsForUser(string username)
        {
            var result = await context.Messages.OrderByDescending(m => m.MessageSent)
                .Include(m=>m.Sender).ThenInclude(s=>s.Photos)
                .Include(m=>m.Recipient).ThenInclude(s => s.Photos)
                .Where(m => ( m.RecipientUsername == username || m.SenderUsername == username))
                .ToListAsync();
            return mapper.Map<List<ChatDto>>(result);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await context.Messages
                .Where(m => m.Recipient.UserName == currentUsername && m.RecipientDeleted==false
            && m.Sender.UserName==recipientUsername
            || m.Recipient.UserName==recipientUsername
            && m.Sender.UserName == currentUsername && m.SenderDeleted==false
            ).OrderBy(m=>m.MessageSent).ProjectTo<MessageDto>(mapper.ConfigurationProvider).ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null && m.RecipientUsername == currentUsername).ToList();
            if (unreadMessages.Any())
            {
                foreach(var message in unreadMessages)
                {
                    message.DateRead= DateTime.UtcNow;
                }
            }
            return messages;
        }

        public void RemoveConnection(Connection connection)
        {
            context.Connections.Remove(connection);
        }
    }
}
