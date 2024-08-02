import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vehicule } from '../model/vehicule.model';

@Component({
  selector: 'app-traiter-dialog',
  templateUrl: './traiter-dialog.component.html',
  styleUrl: './traiter-dialog.component.css'
})
export class TraiterDialogComponent implements OnInit{
[x: string]: any;


  form: FormGroup;
  availableVehicles: Vehicule[] = [];


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TraiterDialogComponent>,
    private aulshService: AulshService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, dateDebut: string, dateFin: string }
  ) {
    this.form = this.fb.group({
      motif: [null, Validators.required],
      vehiculeId: [null]
    });
  }

  ngOnInit(): void {
    this.loadAvailableVehicles();
  }


  loadAvailableVehicles(): void {
    this.aulshService.getAvailableVehicles(this.data.dateDebut, this.data.dateFin).subscribe({
      next: vehicles => {
        this.availableVehicles = vehicles;
      },
      error: () => {
        this.snackBar.open('Error loading available vehicles', 'Close', { duration: 3000 });
      }
    });
  }

  onReject(): void {
    const motif = this.form.get('motif')?.value;
    this.aulshService.rejectAffectation(this.data.id, { motif }).subscribe({
      next: () => {
        this.snackBar.open('Affectation rejected successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error rejecting affectation', 'Close', { duration: 3000 });
      }
    });
  }


  onAccept(): void {
    const motif = this.form.get('motif')?.value;
    const vehiculeId = this.form.get('vehiculeId')?.value;
    this.aulshService.assignVehicleToAffectation(this.data.id, { motif, vehiculeId }).subscribe({
      next: () => {
        this.snackBar.open('Affectation accepted successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error accepting affectation', 'Close', { duration: 3000 });
      }
    });
  }

}
