import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import { TypeOperation } from '../../model/vehicule.model';
import moment from 'moment';


@Component({
  selector: 'app-modifier-assurance-dialog',
  templateUrl: './modifier-assurance-dialog.component.html',
  styleUrl: './modifier-assurance-dialog.component.css'
})
export class ModifierAssuranceDialogComponent implements OnInit {
  assuranceForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;

  constructor(
    private aulshService: AulshService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModifierAssuranceDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.maxDate = new Date();
    this.assuranceForm = this.fb.group({
      dateOperation: ['', Validators.required],
      dateFinValidite: ['', Validators.required],
      nomCentre: ['', Validators.required],
      details: ['', Validators.required],
      cout: ['', [Validators.required, Validators.min(0)]],
      fileName: ['', Validators.required],
      file: [null, Validators.required],
      typeOperation: [TypeOperation.ASSURANCE, Validators.required],
      immatriculation: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    if (this.data) {
      this.assuranceForm.patchValue({
        dateOperation:this.data.dateOperation,
        dateFinValidite:this.data.dateFinValidite,
        nomCentre:this.data.nomCentre,
        details:this.data.details,
        cout:this.data.cout,
        typeOperation:this.data.typeOperation,
        immatriculation:this.data.vehicule.vehiculeSpecif.immatriculation
      });
    }
  }

  getControls(controlName: string) {
    return (this.assuranceForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.assuranceForm.valid && !this.fileError) {
      const formData = new FormData();
      Object.entries(this.assuranceForm.value).forEach(([key, value]) => {
        if (key === 'dateOperation' || key === 'dateFinValidite') {
          formData.append(key, moment(value as Date).format('YYYY-MM-DD'));
        }
        if (key === 'file') {
          formData.append('file', value as File);
        } else {
          formData.append(key, value as string | Blob);
        }
      });
      
      this.aulshService.updateAssurance(this.data.id, formData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error updating vehicle', err);
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        this.assuranceForm.patchValue({ file: null, fileName: '' });
      } else {
        this.fileError = null;
        this.assuranceForm.patchValue({ file, fileName: file.name });
      }
    }
  }
}
