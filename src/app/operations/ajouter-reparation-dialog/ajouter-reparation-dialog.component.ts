import { Component, Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AulshService } from '../../services/aulsh.service';
import { TypeOperation } from '../../model/vehicule.model';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-ajouter-reparation-dialog',
  templateUrl: './ajouter-reparation-dialog.component.html',
  styleUrl: './ajouter-reparation-dialog.component.css'
})
export class AjouterReparationDialogComponent implements OnInit {

  reparationForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjouterReparationDialogComponent>,
    private aulshService: AulshService,
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

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        this.reparationForm.patchValue({ file: null, fileName: '' });
      } else {
        this.fileError = null;
        this.reparationForm.patchValue({ file, fileName: file.name });
      }
    }
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

      this.aulshService.addReparation(formData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error adding reparation', err);
        }
      });
    }
  }
}

