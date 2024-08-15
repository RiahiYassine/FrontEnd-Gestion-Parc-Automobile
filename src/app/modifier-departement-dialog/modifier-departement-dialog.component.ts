import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulshService } from '../services/aulsh.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modifier-departement-dialog',
  templateUrl: './modifier-departement-dialog.component.html',
  styleUrl: './modifier-departement-dialog.component.css'
})
export class ModifierDepartementDialogComponent implements OnInit {
  departementForm: FormGroup;
  
    constructor(
      private aulshService: AulshService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<ModifierDepartementDialogComponent>,
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

  ngOnInit(): void {
    
    if (this.data) {
      this.departementForm.patchValue({
        departement: {
          libelle: this.data.libelle,
          description: this.data.description
        },
        chef: {
          nom: this.data.chef.nom,
          prenom: this.data.chef.prenom,
          email: this.data.chef.email,
          cin: this.data.chef.cin,
          role: this.data.chef.role,
          grade: this.data.chef.grade,
        }
      });
    }
  }

  getControls(controlName: string) {
    return (this.departementForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.departementForm.valid) {
      const departementData = {
        departement: this.departementForm.get('departement')?.value,
        chef: this.departementForm.get('chef')?.value
      };
      
      this.aulshService.updateDepartement(this.data.id, departementData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Erreur lors de la mise à jour du département', err);
        }
      });
    }
  }
  
}

