import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[]=[];
  pagination: Pagination;
  container = 'Outbox';
  pageNumber = 1;
  pageSize = 5;
  dataSource: MatTableDataSource<Message>;
  displayedColumns: string[] = ['Message', 'fromto', 'sentreceived','delete'];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.dataSource = new MatTableDataSource<Message>(this.messages);
  }

  loadMessages() {
    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((response) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.dataSource.data = this.messages;
      });
  }

  handlePageEvent(event: any) {
    if (this.pageNumber !== event.pageIndex + 1) {
      this.pageNumber = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.loadMessages();
    }
  }
}
