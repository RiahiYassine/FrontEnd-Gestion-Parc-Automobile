import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulshService } from '../services/aulsh.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Departement, Grade, RoleUser, User } from '../model/vehicule.model';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-ajouter-employe-dialog',
  templateUrl: './ajouter-employe-dialog.component.html',
  styleUrl: './ajouter-employe-dialog.component.css'
})
export class AjouterEmployeDialogComponent implements OnInit {
  employeForm: FormGroup;
  
  grades = Object.values(Grade);

  departement! : Departement;
  logedEmploye!: User;

  
  constructor(
    private aulshService: AulshService,
    private fb: FormBuilder,
    private authenticationService : AuthenticationService,
    private dialogRef: MatDialogRef<AjouterEmployeDialogComponent>,
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

    const authenticatedUser = this.authenticationService.authenticatedUserDetails;
    if (authenticatedUser) {
      this.logedEmploye = authenticatedUser;
      
      this.employeForm.patchValue({
        departementId: this.logedEmploye.departement?.id,
        role: RoleUser.EMPLOYE
      });
    }
  }

  ngOnInit(): void {}

  getControls(controlName: string) {
    return (this.employeForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.employeForm.valid) {

      const employeData= this.employeForm.value;

      this.aulshService.addEmploye(employeData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error("Erreur lors de l'ajout de l'employé", err);
        }
      });
    }
  }
}


