import { MembersService } from './../../services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]>;

  constructor(private memberService: MembersService) {}
  ngOnInit(): void {
    this.members$ = this.memberService.getMembers();
  }
}
