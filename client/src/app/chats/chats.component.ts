import { ActivatedRoute } from '@angular/router';
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
  filteredchats: Chat[] = [];
  displayedColumns: string[] = ['fromto', 'Message', 'sentreceived', 'seen'];
  loading = false;
  // make this reads dynamic from url maybe
  openchatusername = '';
  searchContact;

  constructor(private messageService: MessageService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadChats();
    this.route.queryParams.subscribe((params) => {
      console.log(params['openchatusername']);
      if (params['openchatusername']) {
        this.openchatusername = params['openchatusername'];
      }
    });
  }

  loadChats() {
    this.loading = true;
    return this.messageService.getChats().subscribe((response) => {
      this.chats = response;
      this.filteredchats = response;
      this.loading = false;
    });
  }

  openChat(username: string) {
    this.openchatusername = username;
  }

  filterContacts(searchContact) {
    console.log(searchContact);
    // write the logic to filter this.chats based on searchContact
    this.filteredchats = this.chats.filter((chat) => {
      return chat.contactUsername
        .toLowerCase()
        .includes(this.searchContact.toLowerCase());
    });
  }
}
