import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AulshService } from '../services/aulsh.service';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { User } from '../model/vehicule.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-consulter-mission-dialog',
  templateUrl: './consulter-mission-dialog.component.html',
  styleUrl: './consulter-mission-dialog.component.css'
})
export class ConsulterMissionDialogComponent implements OnInit {

  missionForm: FormGroup;

  constructor(
    private aulshService: AulshService,
    private authenticationService : AuthenticationService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ConsulterMissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.missionForm = this.fb.group({
      kilometrageInitial: [0, Validators.required],
      kilometrageRetour: [null, Validators.required],
    });
  }

  ngOnInit(): void {
      
    if (this.data) {
      console.log("data:", this.data);

      this.missionForm.patchValue({
        kilometrageInitial: this.data.missiondata.affectation.kilometrageInitial,    
        kilometrageRetour: this.data.missiondata.affectation.kilometrageRetour,    
      });

    }
  }
  
  getControls(controlName: string) {
    return (this.missionForm.get(controlName) as FormArray).controls;
  }

  onSubmit(): void {
    if (this.missionForm.valid) {

      const missionData = this.missionForm.value;
      
      this.aulshService.updateKilometrage(this.data.missiondata.affectation.id, missionData).subscribe({
        next: response => {
          this.dialogRef.close(response);
        },
        error: err => {
          console.error('Error updating kilometrage', err);
        }
      });
    }
  }
}
