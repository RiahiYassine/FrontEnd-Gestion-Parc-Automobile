import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import { TypeOperation } from '../../model/vehicule.model';
import moment from 'moment';


@Component({
  selector: 'app-modifier-reparation-dialog',
  templateUrl: './modifier-reparation-dialog.component.html',
  styleUrl: './modifier-reparation-dialog.component.css'
})
export class ModifierReparationDialogComponent implements OnInit {
  reparationForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;

  constructor(
    private aulshService: AulshService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModifierReparationDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.maxDate = new Date();
    this.reparationForm = this.fb.group({
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
      this.reparationForm.patchValue({
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
    return (this.reparationForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.reparationForm.valid && !this.fileError) {
      const formData = new FormData();
      Object.entries(this.reparationForm.value).forEach(([key, value]) => {
        if (key === 'dateOperation') {
          formData.append(key, moment(value as Date).format('YYYY-MM-DD'));
        }
        if (key === 'file') {
          formData.append('file', value as File);
        } else {
          formData.append(key, value as string | Blob);
        }
      });
      
      this.aulshService.updateReparation(this.data.id, formData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Erreur lors de la mise à jour de la réparation', err);
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Seuls les fichiers PDF sont autorisés.';
        this.reparationForm.patchValue({ file: null, fileName: '' });
      } else {
        this.fileError = null;
        this.reparationForm.patchValue({ file, fileName: file.name });
      }
    }
  }
}
