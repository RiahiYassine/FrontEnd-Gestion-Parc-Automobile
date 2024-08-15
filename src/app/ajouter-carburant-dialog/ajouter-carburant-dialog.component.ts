import { Component, Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { TypeOperation } from '../model/vehicule.model';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ajouter-carburant-dialog',
  templateUrl: './ajouter-carburant-dialog.component.html',
  styleUrl: './ajouter-carburant-dialog.component.css'
})
export class AjouterCarburantDialogComponent implements OnInit {

  carburantForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjouterCarburantDialogComponent>,
    private aulshService: AulshService,
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
      typeOperation: [TypeOperation.CARBURANT, Validators.required],
      immatriculation: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Seuls les fichiers PDF sont autorisés.';
        this.carburantForm.patchValue({ file: null, fileName: '' });
      } else {
        this.fileError = null;
        this.carburantForm.patchValue({ file, fileName: file.name });
      }
    }
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

      this.aulshService.addCarburant(formData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error("Erreur lors de l'ajout de carburant", err);
        }
      });
    }
  }
}


