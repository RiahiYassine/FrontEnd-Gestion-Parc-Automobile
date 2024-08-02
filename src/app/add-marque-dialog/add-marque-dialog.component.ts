import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-marque-dialog',
  templateUrl: './add-marque-dialog.component.html',
  styleUrls: ['./add-marque-dialog.component.css']
})
export class AddMarqueDialogComponent implements OnInit {
  marqueForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMarqueDialogComponent>
  ) {
    this.marqueForm = this.fb.group({
      nomMarque: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.marqueForm.valid) {
      this.dialogRef.close(this.marqueForm.value.nomMarque);
    }
  }
}
