import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Chat } from '../models/chat';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
})
export class ChatsComponent implements OnInit {
  chats: Chat[] = [];
  displayedColumns: string[] = ['fromto', 'Message', 'sentreceived', 'seen'];
  loading = false;
  openchatusername;
  searchContact;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats() {
    this.loading = true;
    return this.messageService.getChats().subscribe((response) => {
      this.chats = response;
      this.loading = false;
    });
  }

  openChat(username: string) {
    this.openchatusername = username;
  }

  searchContacts() {
    console.log(this.searchContact);
  }
}
