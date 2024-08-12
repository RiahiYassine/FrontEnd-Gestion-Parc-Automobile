import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { User } from '../model/vehicule.model';
import { AulshService } from '../services/aulsh.service';

@Component({
  selector: 'app-check-mission-dialog',
  templateUrl: './check-mission-dialog.component.html',
  styleUrls: ['./check-mission-dialog.component.css']
})
export class CheckMissionDialogComponent implements OnInit {
  missionForm: FormGroup;
  maxDate: Date;
  employes: User[] = [];

  constructor(
    private fb: FormBuilder,
    private aulshService: AulshService,
    private dialogRef: MatDialogRef<CheckMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.maxDate = new Date();
    this.missionForm = this.fb.group({
      reference: [''],
      destination: [''],
      objectif: [''],
      dateDebut: [''],
      dateFin: [''],
      responsable: [''],
      chauffeur: [''],
      departementLibelle: [''],
      accompagnantsIds: [[]]  // This should be an array
    });
  }

  ngOnInit(): void {

    

    if (this.data) {

      this.loadEmployes(this.data.missiondata.departement.id)

      const accompagnantIds = this.data.missiondata.accompagnants.map((accompagnant: any) => accompagnant.id);
      this.missionForm.patchValue({
        reference: this.data.missiondata.reference,
        destination: this.data.missiondata.destination,
        objectif: this.data.missiondata.objectif,
        dateDebut: this.data.missiondata.dateDebut,
        dateFin: this.data.missiondata.dateFin,
        responsable: this.data.missiondata.responsable.nom + " " + this.data.missiondata.responsable.prenom,
        chauffeur: this.data.missiondata.chauffeur.nom + " " + this.data.missiondata.chauffeur.prenom,
        departementLibelle: this.data.missiondata.departement.libelle,
        accompagnantsIds: accompagnantIds
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


  getAccompagnantsNames(): string {
    const selectedIds = this.missionForm.get('accompagnantsIds')?.value ?? [];
    const selectedEmployes = this.employes.filter(emp => selectedIds.includes(emp.id));
    return selectedEmployes.map(emp => `${emp.nom} ${emp.prenom}`).join(', ');
  } 
}
