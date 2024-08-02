import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import { TypeOperation } from '../model/vehicule.model';
import moment from 'moment';


@Component({
  selector: 'app-modifier-carburant-dialog',
  templateUrl: './modifier-carburant-dialog.component.html',
  styleUrl: './modifier-carburant-dialog.component.css'
})
export class ModifierCarburantDialogComponent implements OnInit {
  carburantForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;

  constructor(
    private aulshService: AulshService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModifierCarburantDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.maxDate = new Date();
    this.carburantForm = this.fb.group({
      dateOperation: ['', Validators.required],
      nomCentre: ['', Validators.required],
      details: ['', Validators.required],
      cout: ['', [Validators.required, Validators.min(0)]],
      fileName: ['', Validators.required],
      file: [null, Validators.required],
      typeOperation: [TypeOperation.REPARATION, Validators.required],
      immatriculation: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    if (this.data) {
      this.carburantForm.patchValue({
        dateOperation:this.data.dateOperation,
        nomCentre:this.data.nomCentre,
        details:this.data.details,
        cout:this.data.cout,
        typeOperation:this.data.typeOperation,
        immatriculation:this.data.vehicule.vehiculeSpecif.immatriculation
      });
    }
  }

  getControls(controlName: string) {
    return (this.carburantForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.carburantForm.valid && !this.fileError) {
      const formData = new FormData();
      Object.entries(this.carburantForm.value).forEach(([key, value]) => {
        if (key === 'dateOperation') {
          formData.append(key, moment(value as Date).format('YYYY-MM-DD'));
        }
        if (key === 'file') {
          formData.append('file', value as File);
        } else {
          formData.append(key, value as string | Blob);
        }
      });
      
      this.aulshService.updateCarburant(this.data.id, formData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error updating carburant', err);
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        this.carburantForm.patchValue({ file: null, fileName: '' });
      } else {
        this.fileError = null;
        this.carburantForm.patchValue({ file, fileName: file.name });
      }
    }
  }
}

