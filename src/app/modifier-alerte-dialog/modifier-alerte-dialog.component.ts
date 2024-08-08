import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { SeverityLevel, Vehicule } from '../model/vehicule.model';
import { AddTypeAlerteDialogComponent } from '../add-type-alerte-dialog/add-type-alerte-dialog.component';

@Component({
  selector: 'app-modifier-alerte-dialog',
  templateUrl: './modifier-alerte-dialog.component.html',
  styleUrl: './modifier-alerte-dialog.component.css'
})
export class ModifierAlerteDialogComponent implements OnInit {
  alerteForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;
  typeAlertes: string[] = [];
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
    private dialogRef: MatDialogRef<ModifierAlerteDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.maxDate = new Date();
    this.alerteForm = this.fb.group({
      dateReminder : [null],
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

    this.aulshService.getAllVehicules().subscribe({
      next: value => {
        this.vehicules = value;
      },
      error: err => {
        console.log(err);
      }
    });

    if (this.data) {
      this.alerteForm.patchValue({
        dateReminder:this.data.dateReminder,
        message:this.data.message,
        kilometrage:this.data.kilometrage,
        severity:this.data.severity,
        name:this.data.typeAlerte.name,
        id:this.data.id,
      });
    }
  }

  getControls(controlName: string) {
    return (this.alerteForm.get(controlName) as FormArray).controls;
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

  onSubmit(): void {
    if (this.alerteForm.valid && !this.fileError) {
        const formValue = {
            ...this.alerteForm.value,
            dateReminder: this.alerteForm.value.dateReminder 
                ? moment(this.alerteForm.value.dateReminder).format('YYYY-MM-DD') 
                : null
        };

        this.aulshService.updateAlerte(this.data.id, formValue).subscribe({
            next: response => {
                this.dialogRef.close(response);
            },
            error: err => {
                console.error('Error updating alerte', err);
            }
        });
    }
}

  
}
