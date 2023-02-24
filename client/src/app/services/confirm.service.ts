import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './../modals/confirm-dialog/confirm-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private dialogRef: MatDialogRef<ConfirmDialogComponent>

  constructor(private dialog: MatDialog) { }

  confirm(title = 'Confirmation', message = 'Are you sure you want to do this?', btnOkText = 'OK', btnCancelText = 'Cancel'): Observable<boolean> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title,
      message,
      btnOkText,
      btnCancelText,
    };
    dialogConfig.backdropClass = 'blurred';
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    return new Observable<boolean>(this.getResult());
  }

  private getResult(){
    return (observer) => {
      const subscription = this.dialogRef.afterClosed().subscribe(()=> {
        const dialogComponent = this.dialogRef.componentInstance;
        observer.next(dialogComponent.result);
        observer.complete();
      });
      return {
        unsubscribe() {
          subscription.unsubscribe();
        }
      }
    }
  }
}
