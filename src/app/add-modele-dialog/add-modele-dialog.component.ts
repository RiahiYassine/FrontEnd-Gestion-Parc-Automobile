import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-modele-dialog',
  templateUrl: './add-modele-dialog.component.html',
  styleUrls: ['./add-modele-dialog.component.css']
})
export class AddModeleDialogComponent implements OnInit {
  modeleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddModeleDialogComponent>
  ) {
    this.modeleForm = this.fb.group({
      nomModele: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.modeleForm.valid) {
      this.dialogRef.close(this.modeleForm.value.nomModele);
    }
  }
}
