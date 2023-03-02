﻿using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public MessagesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();
            if (username == createMessageDto.RecipientUsername.ToLower())
                return BadRequest("You cannot send messages to yourself");
            var sender = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var recipient = await unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
            if (recipient == null) return NotFound();
            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender?.UserName,
                RecipientUsername = recipient?.UserName,
                Content = createMessageDto.Content
            };
            unitOfWork.MessageRepository.AddMessage(message);
            if (await unitOfWork.Complete()) return Ok(mapper.Map<MessageDto>(message));
            return BadRequest("failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();
            var messages = await unitOfWork.MessageRepository.GetMessagesForUser(messageParams);
            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return messages;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await unitOfWork.MessageRepository.GetMessage(id);
            if (message.Sender.UserName != username && message.Recipient.UserName != username) return Unauthorized();
            if(message.Sender.UserName==username) message.SenderDeleted= true;
            if(message.Recipient.UserName==username) message.RecipientDeleted= true;
            if (message.SenderDeleted && message.RecipientDeleted) unitOfWork.MessageRepository.DeleteMessage(message);
            if (await unitOfWork.Complete()) return Ok();
            return BadRequest("problem deleting the message");
        }

        [HttpGet("Chats")]
        public async Task<ActionResult<List<ChatDto>>> GetChats()
        {
            var username = User.GetUsername();
            var chats = await this.unitOfWork.MessageRepository.GetChatsForUser(username);
            chats.ForEach(c => c.ContactUsername = c.SenderUsername == username ? c.RecipientUsername : c.SenderUsername);
            chats.ForEach(c => c.ContactPhotoUrl = c.SenderUsername == username ? c.RecipientPhotoUrl : c.SenderPhotoUrl);
            var result = chats.GroupBy(c=>c.ContactUsername).Select(c=>c.First()).ToList();
            return Ok(result);
        }
    }
}
