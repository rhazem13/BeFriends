import { MembersService } from './../../services/members.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  member: Member;
  user: User;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if(this.editForm.dirty){
      $event.returnValue=true;
    }
  }

  constructor(private accountService: AccountService, private memberService: MembersService,
    private snackBar: MatSnackBar) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user =user );
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member=>{
      this.member = member;
    })
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(()=>{
      this.snackBar.open('Profile updated succesfully', undefined, {
        duration: 1500,
      });
      this.editForm.reset(this.member);
    })
  }

}
