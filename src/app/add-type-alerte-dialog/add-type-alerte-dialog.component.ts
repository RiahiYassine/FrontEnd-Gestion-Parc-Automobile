import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-type-alerte-dialog',
  templateUrl: './add-type-alerte-dialog.component.html',
  styleUrl: './add-type-alerte-dialog.component.css'
})
export class AddTypeAlerteDialogComponent implements OnInit {
  typeAlerteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTypeAlerteDialogComponent>
  ) {
    this.typeAlerteForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.typeAlerteForm.valid) {
      this.dialogRef.close(this.typeAlerteForm.value.name);
    }
  }
}

