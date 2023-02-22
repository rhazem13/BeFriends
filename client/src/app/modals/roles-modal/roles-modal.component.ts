import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css'],
})
export class RolesModalComponent {
  @Output() updateSelectedRoles = new EventEmitter();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  updateRoles() {
    this.updateSelectedRoles.emit(this.data.roles);
  }
}
