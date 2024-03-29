﻿using API.Entities;

namespace API.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PhotoUrl { get; set; }
        public string CoverUrl { get; set; }
        public int Age{ get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; } 
        public DateTime LastActive { get; set; } 
        public string Gender { get; set; }
        public string Bio { get; set; }
        public string Hobbies { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public List<PhotoDto> Photos { get; set; }
        public bool Followed { get; set; }
    }
}
