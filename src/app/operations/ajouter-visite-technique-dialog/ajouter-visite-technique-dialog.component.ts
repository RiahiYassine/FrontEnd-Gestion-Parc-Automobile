import { Component, Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AulshService } from '../../services/aulsh.service';
import { TypeOperation } from '../../model/vehicule.model';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ajouter-visite-technique-dialog',
  templateUrl: './ajouter-visite-technique-dialog.component.html',
  styleUrl: './ajouter-visite-technique-dialog.component.css'
})
export class AjouterVisiteTechniqueDialogComponent implements OnInit {
  visiteTechniqueForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjouterVisiteTechniqueDialogComponent>,
    private aulshService: AulshService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('fr');
    this.maxDate = new Date();
    this.visiteTechniqueForm = this.fb.group({
      dateOperation: ['', Validators.required],
      dateFinValidite: ['', Validators.required],
      nomCentre: ['', Validators.required],
      details: ['', Validators.required],
      cout: ['', [Validators.required, Validators.min(0)]],
      fileName: ['', Validators.required],
      file: [null, Validators.required],
      typeOperation: [TypeOperation.VISITE_TECHNIQUE, Validators.required],
      immatriculation: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Only PDF files are allowed.';
        this.visiteTechniqueForm.patchValue({ file: null, fileName: '' });
      } else {
        this.fileError = null;
        this.visiteTechniqueForm.patchValue({ file, fileName: file.name });
      }
    }
  }

  onSubmit(): void {
    if (this.visiteTechniqueForm.valid && !this.fileError) {
      const formData = new FormData();
      Object.entries(this.visiteTechniqueForm.value).forEach(([key, value]) => {

        if (key === 'dateOperation' || key === 'dateFinValidite') {
          formData.append(key, moment(value as Date).format('YYYY-MM-DD'));
        }
        if (key === 'file') {
          formData.append('file', value as File);
        } else {
          formData.append(key, value as string | Blob);
        }
      });

      this.aulshService.addVisiteTechnique(formData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error adding visite technique', err);
        }
      });
    }
  }
}

