import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import { CategorieVehicule, StatusVehicule, TypeCarburant, TypeImmatriculation, TypeTransmission } from '../model/vehicule.model';
import { AddMarqueDialogComponent } from '../add-marque-dialog/add-marque-dialog.component';
import { AddModeleDialogComponent } from '../add-modele-dialog/add-modele-dialog.component';
import moment from 'moment';


@Component({
  selector: 'app-ajouter-vehicule-dialog',
  templateUrl: './ajouter-vehicule-dialog.component.html',
  styleUrls: ['./ajouter-vehicule-dialog.component.css']
})
export class AjouterVehiculeDialogComponent implements OnInit {
  vehiculeForm: FormGroup;
  typeCarburantOptions = Object.values(TypeCarburant);
  typeImmatriculationOptions = Object.values(TypeImmatriculation);
  statusVehicules = Object.values(StatusVehicule);
  categories = Object.values(CategorieVehicule);
  transmissions = Object.values(TypeTransmission);
  marques: string[] = [];
  modeles: string[] = [];
  maxDate: Date;

  constructor(
    private aulshService: AulshService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjouterVehiculeDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr'); // Optional: Set the locale to French
    this.maxDate = new Date(); // Set max date to today
    this.vehiculeForm = this.fb.group({
      vehicule: this.fb.group({
        dateEntree: ['', Validators.required],
        statusVehicule: ['', Validators.required],
        categorieVehicule: ['', Validators.required],
        typeTransmission: ['', Validators.required],
      }),
      vehiculeSpecif: this.fb.group({
        numeroChassis: ['', Validators.required],
        typeImmatriculation: ['', Validators.required],
        immatriculation: ['', Validators.required],
        puissance: ['', [Validators.required, Validators.min(0)]],
        poids: ['', [Validators.required, Validators.min(0)]],
        nombreDePlaces: ['', [Validators.required, Validators.min(0)]],
        kilometrage: ['', [Validators.required, Validators.min(0)]],
        typeCarburant: ['', Validators.required],
        modele: this.fb.group({
          nomModele: ['', Validators.required],
          marque: this.fb.group({
            nomMarque: ['', Validators.required]
          })
        })
      })
    });
  }

  ngOnInit(): void {
    this.aulshService.getAllMarques().subscribe({
      next: marques => {
        this.marques = marques;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllModeles().subscribe({
      next: modeles => {
        this.modeles = modeles;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getControls(controlName: string) {
    return (this.vehiculeForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.vehiculeForm.valid) {

      const vehiculeFormValues = this.vehiculeForm.value;

      const formattedDateEntree = moment(vehiculeFormValues.vehicule.dateEntree).format('YYYY-MM-DD');

      const vehiculeData = {
        vehicule: {
          ...vehiculeFormValues.vehicule,
          dateEntree: formattedDateEntree
        },
        vehiculeSpecif: vehiculeFormValues.vehiculeSpecif
      };
      
      this.aulshService.addVehicule(vehiculeData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error("Erreur lors de l'ajout du véhicule", err);
        }
      });
    }
  }
  

  openAddMarqueDialog(): void {
    const dialogRef = this.dialog.open(AddMarqueDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.marques.push(result);
        this.vehiculeForm.get('vehiculeSpecif.modele.marque.nomMarque')?.setValue(result);
      }
    });
  }

  openAddModeleDialog(): void {
    const dialogRef = this.dialog.open(AddModeleDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.modeles.push(result);
        this.vehiculeForm.get('vehiculeSpecif.modele.nomModele')?.setValue(result);
      }
    });
  }
}
