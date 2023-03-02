import { Component, OnInit } from '@angular/core';
import { ConfirmService } from './../services/confirm.service';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { MessageService } from '../services/message.service';
import { Chat } from '../models/chat';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
})
export class ChatsComponent implements OnInit {
  chats: Chat[] = [];
  dataSource: MatTableDataSource<Chat>;
  displayedColumns: string[] = ['fromto', 'Message', 'sentreceived', 'seen'];
  loading = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadChats();
    this.dataSource = new MatTableDataSource<Chat>(this.chats);
  }

  loadChats() {
    this.loading = true;
    return this.messageService.getChats().subscribe((response) => {
      this.chats = response;
      this.dataSource.data = this.chats;
      this.loading = false;
      console.log(response);
    });
  }
}
