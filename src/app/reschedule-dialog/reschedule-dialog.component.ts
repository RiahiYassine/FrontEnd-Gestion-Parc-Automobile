import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reschedule-dialog',
  templateUrl: './reschedule-dialog.component.html',
  styleUrl: './reschedule-dialog.component.css'
})
export class RescheduleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RescheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

}
