import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import { CategorieMaintenance, TypeOperation } from '../../model/vehicule.model';
import moment from 'moment';

@Component({
  selector: 'app-modifier-maintenance-dialog',
  templateUrl: './modifier-maintenance-dialog.component.html',
  styleUrl: './modifier-maintenance-dialog.component.css'
})
export class ModifierMaintenanceDialogComponent implements OnInit {
  maintenanceForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;

  categorieMaintenancesOptions = Object.values(CategorieMaintenance);


  constructor(
    private aulshService: AulshService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModifierMaintenanceDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.maxDate = new Date();
    this.maintenanceForm = this.fb.group({
      dateOperation: ['', Validators.required],
      nomCentre: ['', Validators.required],
      details: ['', Validators.required],
      cout: ['', [Validators.required, Validators.min(0)]],
      fileName: ['', Validators.required],
      file: [null, Validators.required],
      typeOperation: [TypeOperation.MAINTENANCE, Validators.required],
      immatriculation: ['', Validators.required],
      categorieMaintenance:['',Validators.required]
    });
  }

  ngOnInit(): void {

    if (this.data) {
      this.maintenanceForm.patchValue({
        dateOperation:this.data.dateOperation,
        nomCentre:this.data.nomCentre,
        details:this.data.details,
        cout:this.data.cout,
        typeOperation:this.data.typeOperation,
        TypeOperation:this.data.categorieMaintenance,
        immatriculation:this.data.vehicule.vehiculeSpecif.immatriculation,
        categorieMaintenance:this.data.categorieMaintenance
      });
    }
  }

  getControls(controlName: string) {
    return (this.maintenanceForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.maintenanceForm.valid && !this.fileError) {
      const formData = new FormData();
      Object.entries(this.maintenanceForm.value).forEach(([key, value]) => {
        if (key === 'dateOperation') {
          formData.append(key, moment(value as Date).format('YYYY-MM-DD'));
        }
        if (key === 'file') {
          formData.append('file', value as File);
        } else {
          formData.append(key, value as string | Blob);
        }
      });
      
      this.aulshService.updateMaintenance(this.data.id, formData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error updating maintenance', err);
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        this.maintenanceForm.patchValue({ file: null, fileName: '' });
      } else {
        this.fileError = null;
        this.maintenanceForm.patchValue({ file, fileName: file.name });
      }
    }
  }
}

