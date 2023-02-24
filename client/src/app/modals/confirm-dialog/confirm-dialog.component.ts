import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent {
  public result: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  confirm() {
    this.result= true;
  }

  decline(){
    this.result=false;
  }
}
