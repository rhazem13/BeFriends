import { PresenceService } from './../../services/presence.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MembersService } from './../../services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent  {
  constructor(private memberService: MembersService,private snackBar: MatSnackBar, public presenceService: PresenceService){}
  @Input() member: Member;

  addFollow(member: Member){
    this.memberService.addFollow(member.username).subscribe(()=>{
      this.snackBar.open("you have followed " + member.knownAs,undefined,{duration:1500})
    })
  }
}
