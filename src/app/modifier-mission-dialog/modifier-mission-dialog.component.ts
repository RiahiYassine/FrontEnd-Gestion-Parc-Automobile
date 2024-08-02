import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { User } from '../model/vehicule.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-modifier-mission-dialog',
  templateUrl: './modifier-mission-dialog.component.html',
  styleUrl: './modifier-mission-dialog.component.css'
})
export class ModifierMissionDialogComponent implements OnInit {
  missionForm: FormGroup;
  maxDate: Date;
  employes: User[] = [];
  logedEmploye! : User;
  responsable!: User;

  constructor(
    private aulshService: AulshService,
    private authenticationService : AuthenticationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModifierMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.maxDate = new Date();
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
  
    if (this.data) {
      console.log("data:", this.data);

      const accompagnantIds = this.data.accompagnants.map((accompagnant: any) => accompagnant.id);

      this.missionForm.patchValue({
        reference: this.data.reference,
        destination: this.data.destination,
        objectif: this.data.objectif,
        dateDebut: this.data.dateDebut,
        dateFin: this.data.dateFin,
        responsableId: this.data.responsable.id,
        chauffeurId: this.data.chauffeur.id,
        departementId: this.data.departement.id,
        accompagnantsIds: accompagnantIds
      });

      this.aulshService.getEmployeById(this.data.responsable.id).subscribe({
        next: (responsable) => {
          this.responsable = responsable;
          console.log("responsable", responsable);
        },
        error: (err) => {
          console.error('Error fetching responsable', err);
        }
      });

    }
  }
  
  loadEmployes(departementId: number): void {
    this.aulshService.getAllEmployesByDepartement(departementId).subscribe({
      next: (employes) => {
        this.employes = employes;
      },
      error: (err) => {
        console.error('Error fetching employees', err);
      }
    });
  }
  
  getControls(controlName: string) {
    return (this.missionForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.missionForm.valid) {
      const missionData = this.missionForm.value;

      // Format dates using moment.js before sending the request
      missionData.dateDebut = moment(missionData.dateDebut).format('YYYY-MM-DD');
      missionData.dateFin = moment(missionData.dateFin).format('YYYY-MM-DD');
      
      this.aulshService.updateMission(this.data.id, missionData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error updating mission', err);
        }
      });
    }
  }
}
