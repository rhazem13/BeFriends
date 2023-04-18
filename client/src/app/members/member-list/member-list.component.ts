import { MembersService } from './../../services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 8;
  pageSizeOptions = [8, 16, 32];
  searchName = '';
  constructor(private memberService: MembersService) {}
  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    console.log("inside load members");
    console.log(this.searchName);

    this.memberService
      .getMembers(this.searchName,this.pageNumber, this.pageSize)
      .subscribe((response) => {
        this.members = response.result;
        this.pagination = response.pagination;
        console.log(this.members);
      });
  }

  handlePageEvent(event: any) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadMembers();
  }

  filterMembers(){
    console.log(this.searchName);
    this.members=[];
    this.loadMembers();

  }
}
