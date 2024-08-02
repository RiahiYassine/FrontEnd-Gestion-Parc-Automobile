import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import { TypeCarburant, TypeImmatriculation, Disponibilite } from '../model/vehicule.model';
import { AddMarqueDialogComponent } from '../add-marque-dialog/add-marque-dialog.component';
import { AddModeleDialogComponent } from '../add-modele-dialog/add-modele-dialog.component';

@Component({
  selector: 'app-modifier-vehicule-dialog',
  templateUrl: './modifier-vehicule-dialog.component.html',
  styleUrls: ['./modifier-vehicule-dialog.component.css']
})
export class ModifierVehiculeDialogComponent implements OnInit {
  vehiculeForm: FormGroup;
  typeCarburantOptions = Object.values(TypeCarburant);
  typeImmatriculationOptions = Object.values(TypeImmatriculation);
  disponibiliteOptions = [
    { label: 'Disponible', value: true },
    { label: 'Indisponible', value: false }
  ];
  marques: string[] = [];
  modeles: string[] = [];
  maxDate: Date;

  constructor(
    private aulshService: AulshService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModifierVehiculeDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr'); // Optional: Set the locale to French
    this.maxDate = new Date(); // Set max date to today
    this.vehiculeForm = this.fb.group({
      vehicule: this.fb.group({
        dateEntree: ['', Validators.required],
        disponibilite: [true, Validators.required]
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

    // Patch the form with the received data
    if (this.data) {
      this.vehiculeForm.patchValue({
        vehicule: {
          dateEntree: this.data.dateEntree,
          disponibilite: this.data.disponibilite
        },
        vehiculeSpecif: {
          numeroChassis: this.data.vehiculeSpecif.numeroChassis,
          typeImmatriculation: this.data.vehiculeSpecif.typeImmatriculation,
          immatriculation: this.data.vehiculeSpecif.immatriculation,
          puissance: this.data.vehiculeSpecif.puissance,
          poids: this.data.vehiculeSpecif.poids,
          nombreDePlaces: this.data.vehiculeSpecif.nombreDePlaces,
          kilometrage: this.data.vehiculeSpecif.kilometrage,
          typeCarburant: this.data.vehiculeSpecif.typeCarburant,
          modele: {
            nomModele: this.data.vehiculeSpecif.modele.nomModele,
            marque: {
              nomMarque: this.data.vehiculeSpecif.modele.marque.nomMarque
            }
          }
        }
      });
    }
  }

  getControls(controlName: string) {
    return (this.vehiculeForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.vehiculeForm.valid) {
      const vehiculeData = {
        vehicule: this.vehiculeForm.get('vehicule')?.value,
        vehiculeSpecif: this.vehiculeForm.get('vehiculeSpecif')?.value
      };
      
      this.aulshService.updateVehicule(this.data.id, vehiculeData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error updating vehicle', err);
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
