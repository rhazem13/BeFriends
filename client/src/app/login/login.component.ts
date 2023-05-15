import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { BusyService } from '../services/busy.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  model: any = {};
  wrongCreds=false;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  login() {
    this.accountService.login(this.model).subscribe(
      (response) => {
        this.router.navigateByUrl('/feed');
        console.log(response);
      },
      (error) => {
        this.wrongCreds=true;
        this.snackBar.open(error.error, undefined, {
          duration: 1500,
        });
      }
    );
  }
}
