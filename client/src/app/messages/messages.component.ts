import { ConfirmService } from './../services/confirm.service';
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
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  dataSource: MatTableDataSource<Message>;
  displayedColumns: string[] = ['Message', 'fromto', 'sentreceived','delete'];
  loading=false;

  constructor(private messageService: MessageService, private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.dataSource = new MatTableDataSource<Message>(this.messages);
  }

  loadMessages() {
    this.loading=true;
    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((response) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.dataSource.data = this.messages;
        this.loading=false;
      });
  }

  deleteMessage(id: number){
    this.confirmService.confirm('Confirm delete message', 'This Cannot be undone').subscribe(result=>{
      if(result){
        this.messageService.deleteMessage(id).subscribe(() => {
          this.messages.splice(
            this.messages.findIndex((m) => m.id === id),
            1
          );
          this.dataSource.data = this.messages;
        });
      }
    })
  }

  handlePageEvent(event: any) {
    if (this.pageNumber !== event.pageIndex + 1) {
      this.pageNumber = event.pageIndex + 1;
      this.pageSize = event.pageSize;
      this.loadMessages();
    }
  }
}
