import { getPost } from './../models/getpost';
import { FeedService } from './../services/feed.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  user: User;
  constructor(
    private feedService: FeedService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }
  posts: getPost[] = [];

  ngOnInit(): void {
    this.feedService.getPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }
}
