import { BusyService } from './../../services/busy.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() sidenavToggle = new EventEmitter<void>();
  model: any = {};

  constructor(
    public accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar,
    public busyService: BusyService
  ) {}

  login() {
    this.accountService.login(this.model).subscribe(
      (response) => {
        this.router.navigateByUrl('/members');
        console.log(response);
      },
      (error) => {
        this.snackBar.open(error.error, undefined, {
          duration: 1500,
        });
      }
    );
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
