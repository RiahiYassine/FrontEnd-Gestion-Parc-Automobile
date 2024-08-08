import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import { TypeCarburant, TypeImmatriculation, Disponibilite, SeverityLevel, Vehicule } from '../model/vehicule.model';
import moment from 'moment';
import { AddTypeAlerteDialogComponent } from '../add-type-alerte-dialog/add-type-alerte-dialog.component';

@Component({
  selector: 'app-ajouter-alerte-dialog',
  templateUrl: './ajouter-alerte-dialog.component.html',
  styleUrl: './ajouter-alerte-dialog.component.css'
})
export class AjouterAlerteDialogComponent implements OnInit {

  alerteForm: FormGroup;

  typeAlertes: string[] = [];
  matricules: string[] = [];
  minDate: Date;
  severities = Object.values(SeverityLevel)
  vehicules! : Vehicule[]


 atLeastOneRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateReminder = control.get('dateReminder')?.value;
    const kilometrage = control.get('kilometrage')?.value;

    if (!dateReminder && !kilometrage) {
      return { atLeastOneRequired: true };
    }
    return null;
  };
}

  constructor(
    private aulshService: AulshService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjouterAlerteDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.minDate = new Date();
    this.alerteForm = this.fb.group({
      dateReminder :  [null],
      message : ['', Validators.required],
      severity: ['', Validators.required],
      kilometrage: [null],
      typeAlerte : this.fb.group({
        name : ['', Validators.required],
      }),
      vehicule : this.fb.group({
        id : [, Validators.required],
      })

    }, { validators: this.atLeastOneRequired() }); 
  }

  ngOnInit(): void {
    this.aulshService.getAllTypeAlertes().subscribe({
      next: typeAlertes => {
        this.typeAlertes = typeAlertes;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllAlertesMatricules().subscribe({
      next: matricules => {
        this.matricules = matricules;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllVehicules().subscribe({
      next: value => {
        this.vehicules = value;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getControls(controlName: string) {
    return (this.alerteForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.alerteForm.valid) {

      const alerteFormValues = this.alerteForm.value;

      // Check if dateReminder is null before formatting
      const formattedDateEntree = alerteFormValues.dateReminder 
        ? moment(alerteFormValues.dateReminder).format('YYYY-MM-DD') 
        : null;

      const alerteData = {
        dateReminder: formattedDateEntree,
        message: alerteFormValues.message,
        severity: alerteFormValues.severity,
        kilometrage: alerteFormValues.kilometrage,
        typeAlerte: alerteFormValues.typeAlerte,
        vehicule: alerteFormValues.vehicule
      };
      
      this.aulshService.addAlerte(alerteData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error adding alerte', err);
        }
      });
    }
}

  

  openAddTypeAlerteDialog(): void {
    const dialogRef = this.dialog.open(AddTypeAlerteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.typeAlertes.push(result);
        this.alerteForm.get('typeAlerte.name')?.setValue(result);
      }
    });
  }

 
}
