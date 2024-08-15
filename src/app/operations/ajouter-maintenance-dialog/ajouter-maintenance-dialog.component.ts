import { Component, Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AulshService } from '../../services/aulsh.service';
import { CategorieMaintenance, TypeOperation } from '../../model/vehicule.model';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-ajouter-maintenance-dialog',
  templateUrl: './ajouter-maintenance-dialog.component.html',
  styleUrl: './ajouter-maintenance-dialog.component.css'
})
export class AjouterMaintenanceDialogComponent implements OnInit {

  maintenanceForm: FormGroup;
  maxDate: Date;
  fileError: string | null = null;

  categorieMaintenancesOptions = Object.values(CategorieMaintenance);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AjouterMaintenanceDialogComponent>,
    private aulshService: AulshService,
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

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.fileError = 'Seuls les fichiers PDF sont autorisés..';
        this.maintenanceForm.patchValue({ file: null, fileName: '' });
      } else {
        this.fileError = null;
        this.maintenanceForm.patchValue({ file, fileName: file.name });
      }
    }
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

      this.aulshService.addMaintenance(formData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error("Erreur lors de l'ajout de la maintenance", err);
        }
      });
    }
  }
}

