import { AccountService } from 'src/app/services/account.service';
import { PresenceService } from './../../services/presence.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/models/member';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgxGalleryImage,
  NgxGalleryOptions,
  NgxGalleryAnimation,
} from '@kolkov/ngx-gallery';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';
import { take } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: MatTabGroup;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: MatTab;
  messages: Message[] = [];
  user: User;

  constructor(
    public presenceService: PresenceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user =user);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    })
    this.route.queryParams.subscribe(params => {
      params.tab?this.selectTab(params.tab) : this.selectTab(0);
      if (params.tab == 3) {
        this.messageService.createHubConnection(
          this.user,
          this.member.username
        );
      }
    })
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      },
    ];
    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      });
    }
    return imageUrls;
  }

  loadMessages() {
    this.messageService
      .getMessageThread(this.member.username)
      .subscribe((messages) => {
        this.messages = messages;
      });
  }

  selectTab(tabId: number){
    this.memberTabs.selectedIndex = tabId;
  }

  onTabActivated(data: MatTab) {
    this.activeTab = data['tab'];
    if (this.activeTab.textLabel === 'Messages' && this.messages.length === 0) {
      console.log("create hub connection");
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
