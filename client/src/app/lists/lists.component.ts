import { Pagination } from './../models/pagination';
import { MembersService } from './../services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from '../models/member';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;
  predicate = 'followed';
  pageNumber = 1;
  pageSize = 8;
  pagination: Pagination;
  pageSizeOptions = [8, 16, 32];

  constructor(private memberService: MembersService) {}
  ngOnInit(): void {
    this.loadFollows();
  }

  loadFollows() {
    this.memberService
      .getFollows(this.predicate, this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.members = response.result;
        this.pagination = response.pagination;
      });
  }

  handlePageEvent(event: any) {
    this.pageNumber = event.pageIndex+1;
    this.pageSize = event.pageSize;
    this.loadFollows();
  }
}
