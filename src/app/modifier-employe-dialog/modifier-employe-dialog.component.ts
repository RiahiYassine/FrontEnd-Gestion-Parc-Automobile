import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulshService } from '../services/aulsh.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Departement, Grade, User } from '../model/vehicule.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-modifier-employe-dialog',
  templateUrl: './modifier-employe-dialog.component.html',
  styleUrl: './modifier-employe-dialog.component.css'
})
export class ModifierEmployeDialogComponent implements OnInit {
  employeForm: FormGroup;
  grades = Object.values(Grade);
  departement! : Departement;
  logedEmploye!: User;

    constructor(
      private aulshService: AulshService,
      private fb: FormBuilder,
      private authenticationService : AuthenticationService,
      private dialogRef: MatDialogRef<ModifierEmployeDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any    ) {
        this.employeForm = this.fb.group({
          nom: ['', Validators.required],
          prenom: ['', Validators.required],
          email: ['', Validators.required],
          cin: ['', Validators.required],
          password: ['', Validators.required],
          role: ['', Validators.required],
          grade: ['', Validators.required],
          departementId: ['', Validators.required],
        });
      }

      
  ngOnInit(): void {
    
    if (this.data) {

      console.log("data",this.data)

      this.employeForm.patchValue({
        nom: this.data.nom,
        prenom: this.data.prenom,
        libelle: this.data.libelle,
        email: this.data.email,
        cin: this.data.cin,
        password: this.data.password,
        role: this.data.role,
        grade: this.data.grade,
        departementId: this.data.departement.id,  // Set the department ID
      });
    }
  }

  getControls(controlName: string) {
    return (this.employeForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.employeForm.valid) {
      const employedata = this.employeForm.value;
      
      this.aulshService.updateEmploye(this.data.id, employedata).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error updating employe', err);
        }
      });
    }
  }
  
}


