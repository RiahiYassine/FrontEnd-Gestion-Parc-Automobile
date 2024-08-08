import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-finish-dialog',
  templateUrl: './confirmation-finish-dialog.component.html',
  styleUrl: './confirmation-finish-dialog.component.css'
})
export class ConfirmationFinishDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationFinishDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
