import { MatSnackBar } from '@angular/material/snack-bar';
import { getPost } from './../models/getpost';
import { FeedService } from './../services/feed.service';
import { Component, OnInit, NgModule } from '@angular/core';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Chat } from '../models/chat';
import { MessageService } from '../services/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  user: User;
  selectedFile: File = null;
  content: string = '';
  chats: Chat[] = [];

  constructor(
    private feedService: FeedService,
    private accountService: AccountService,
    private snackbar: MatSnackBar,
    private messageService: MessageService,
    private router: Router
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }
  posts: getPost[] = [];

  ngOnInit(): void {
    this.loadChats();

    this.feedService.getPosts().subscribe((posts) => {
      this.posts = posts;
      console.log(posts);
    });
  }
  loadChats() {
    return this.messageService.getChats().subscribe((response) => {
      this.chats = response;
    });
  }
  refreshPage() {
    location.reload();
  }

  // called when a file is selected from input element
  onFileSelected(event): void {
    this.selectedFile = event.target.files[0];
  }

  // called when form is submitted
  submitPost(): void {
    console.log('Content:', this.content);

    const formData = new FormData();
    formData.append('content', this.content);
    if (this.selectedFile != null) {
      console.log('Filename:', this.selectedFile.name);
      formData.append('image', this.selectedFile, this.selectedFile.name);
    } else {
      formData.append('image', null);
    }
    // send data to server using HTTP Client or other methods.
    this.feedService.createPost(formData).subscribe((response) => {
      console.log(response);
      this.snackbar.open('Post Created Successfully', undefined, {
        duration: 3000,
      });
      this.content = '';
      this.selectedFile = null;
    });
  }

  openChat(username: string) {
    console.log(username);
    this.router.navigate(['chats'], {
      queryParams: { openchatusername: username },
    });
  }
}
