import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { BusyService } from 'src/app/services/busy.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent {
  @Output() closeSidenav = new EventEmitter<void>();
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

  onClose() {
    this.closeSidenav.emit();
  }
}
