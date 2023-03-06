import { NgForm } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';
import { AccountService } from 'src/app/services/account.service';
import { take } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('messageForm') messageForm: NgForm;
  messages: Message[];
  @Input() username?: string;
  messageContent: string = '';
  user: User;

  constructor(
    public messageService: MessageService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
  ngOnInit(): void {
    this.messageService.createHubConnection(this.user, this.username);
  }

  ngOnChanges() {
    this.messageService.stopHubConnection();
    this.messageService.createHubConnection(this.user, this.username);
    
  }

  sendMessage() {
    this.messageService
      .sendMessage(this.username, this.messageContent)
      .then(() => {
        this.messageForm.resetForm();
      });
  }

  loadMessages() {
    this.messageService
      .getMessageThread(this.username)
      .subscribe((messages) => {
        this.messages = messages;
      });
  }
}
