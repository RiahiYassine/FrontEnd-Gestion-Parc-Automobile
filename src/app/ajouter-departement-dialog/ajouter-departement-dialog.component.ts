import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulshService } from '../services/aulsh.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ajouter-departement-dialog',
  templateUrl: './ajouter-departement-dialog.component.html',
  styleUrl: './ajouter-departement-dialog.component.css'
})
export class AjouterDepartementDialogComponent implements OnInit {
    departementForm: FormGroup;
  
    constructor(
      private aulshService: AulshService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AjouterDepartementDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any    ) {
      this.departementForm = this.fb.group({
        departement: this.fb.group({
          libelle: ['', Validators.required],
          description: ['', Validators.required]
        }),
        chef: this.fb.group({
          nom: ['', Validators.required],
          prenom: ['', Validators.required],
          email: ['', Validators.required],
          cin: ['', Validators.required],
          password: ['', Validators.required],
          role: ['', Validators.required],
          grade: ['', Validators.required],
        })
      });
    }
  
    ngOnInit(): void {}
  
    getControls(controlName: string) {
      return (this.departementForm.get(controlName) as FormArray).controls;
    }
  
    onSubmit(): void {
      if (this.departementForm.valid) {
  
        const vehiculeFormValues = this.departementForm.value;

        this.aulshService.addDepartement(vehiculeFormValues).subscribe({
          next: response => {
            this.dialogRef.close(response);
          },
          error: err => {
            console.error('Error adding departement', err);
          }
        });
      }
    }
  }
  
