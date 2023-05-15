import { Member } from './../../models/member';
import { MembersService } from './../../services/members.service';
import { NgForm } from '@angular/forms';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  OnChanges,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
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
  encapsulation: ViewEncapsulation.None,
})
export class MemberMessagesComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('messageForm') messageForm: NgForm;
  messages: Message[];
  @Input() username?: string;
  messageContent: string = '';
  user: User;
  contact: Member;
  latestDate?: Date = null;
  // emoji
  emoji: string = '';

  selectEmoji(event: any) {
    const emoji = event.emoji;
    this.messageContent += emoji.native;
    const nullIndex = this.messageContent.indexOf('null');
    if (nullIndex !== -1) {
      this.messageContent = this.messageContent.replace('null', '');
    }
  }

  //

  constructor(
    public messageService: MessageService,
    private accountService: AccountService,
    private memberService: MembersService,
    private elementRef: ElementRef,
    private renderer: Renderer2
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
    this.contact = null;
    this.messageService.stopHubConnection();
    this.messageService.createHubConnection(this.user, this.username);
    this.memberService
      .getMember(this.username)
      .subscribe((member) => (this.contact = member));
  }

  sendMessage() {
    if (this.messageContent != '') {
      this.messageForm.form.disable();

      this.messageService
        .sendMessage(this.username, this.messageContent)
        .then(() => {
          this.messageForm.resetForm();
          this.scrollToBottom();

          this.messageForm.form.enable();
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          // Enable form submission in case of error
          this.messageForm.form.enable();
        });
    }
  }

  loadMessages() {
    this.messageService
      .getMessageThread(this.username)
      .subscribe((messages) => {
        this.messages = messages;
        this.scrollToBottom();

      });
  }

  displaydate(curDate: Date): boolean {
    curDate = new Date(curDate);
    if (this.latestDate == null) {
      this.latestDate = new Date(curDate);
      return true;
    } else {
      let diff = Math.floor(
        (curDate.getTime() - this.latestDate.getTime()) / 1000 / 60 / 60
      );
      console.log(diff);
      if (diff != 0) {
        this.latestDate = curDate;
        return true;
      }
      return false;
    }
  }

  scrollToBottom() {
  setTimeout(() => {
    const scrollContainer = this.elementRef.nativeElement.querySelector('.chat');
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, 0);
  }
}
