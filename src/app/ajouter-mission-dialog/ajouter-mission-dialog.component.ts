import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { AulshService } from '../services/aulsh.service';
import { User } from '../model/vehicule.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-ajouter-mission-dialog',
  templateUrl: './ajouter-mission-dialog.component.html',
  styleUrl: './ajouter-mission-dialog.component.css'
})
export class AjouterMissionDialogComponent implements OnInit {
  missionForm: FormGroup;
  employes: User[] = []; // This will hold the employees for the selected department
  logedEmploye! : User;
  maxDate: Date;

  constructor(
    private fb: FormBuilder,
    private aulthService: AulshService,
    private authenticationService : AuthenticationService,
    private dialogRef: MatDialogRef<AjouterMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.maxDate = new Date(); // Set max date to today
    this.missionForm = this.fb.group({
      reference: ['', Validators.required],
      destination: ['', Validators.required],
      objectif: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      responsableId: [null, Validators.required],
      chauffeurId: [null, Validators.required],
      departementId: [null, Validators.required],
      accompagnantsIds: [[]]  // This should be an array

    });
  }

  ngOnInit(): void {
    const authenticatedUser = this.authenticationService.authenticatedUserDetails;
    if (authenticatedUser) {
      this.logedEmploye = authenticatedUser;
      const departementId = this.logedEmploye.departement?.id;
      if (departementId !== undefined) {
        this.loadEmployes(departementId);
      }
    }
  }

  loadEmployes(departementId: number): void {
    this.aulthService.getAllEmployesByDepartement(departementId).subscribe({
      next: (employes) => {
        console.log(employes); // Check if this logs the expected data
        this.employes = employes;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des employés', err);
      }
    });
  }
  


  onDepartmentChange(departementId: number): void {
    this.loadEmployes(departementId);
  }

  onSubmit(): void {
    if (this.missionForm.valid) {
      const missionData = {
        ...this.missionForm.value,
        dateDebut: moment(this.missionForm.value.dateDebut).format('YYYY-MM-DD'),
        dateFin: moment(this.missionForm.value.dateFin).format('YYYY-MM-DD')
      };

      console.log(missionData)

      this.aulthService.addMission(missionData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error("Erreur lors de l'ajout de la mission", err);
        }
      });
    }
  }

  addAccompagnant(accompagnantId: number): void {
    const accompagnantsArray = this.missionForm.get('accompagnantsIds') as FormArray;
    accompagnantsArray.push(this.fb.control(accompagnantId));
  }

  removeAccompagnant(index: number): void {
    const accompagnantsArray = this.missionForm.get('accompagnantsIds') as FormArray;
    accompagnantsArray.removeAt(index);
  }
}
