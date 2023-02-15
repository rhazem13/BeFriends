import { BusyService } from './../services/busy.service';
import { AccountService } from './../services/account.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public accountService: AccountService, private router: Router,
    private snackBar: MatSnackBar, public busyService: BusyService) {}

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe(
      (response) => {
        this.router.navigateByUrl('/members');
        console.log(response);
      },
      (error) => {
        this.snackBar.open(error.error,undefined,{
          duration: 1500,
        });
      }
    );
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
