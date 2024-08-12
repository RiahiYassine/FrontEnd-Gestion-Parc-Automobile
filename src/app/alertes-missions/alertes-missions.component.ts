import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AulshService } from '../services/aulsh.service';
import { AlerteStatus, Mission, SeverityLevel, User } from '../model/vehicule.model';
import { AjouterAlerteDialogComponent } from '../ajouter-alerte-dialog/ajouter-alerte-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationFinishDialogComponent } from '../confirmation-finish-dialog/confirmation-finish-dialog.component';
import { ModifierAlerteDialogComponent } from '../modifier-alerte-dialog/modifier-alerte-dialog.component';
import { AuthenticationService } from '../services/authentication.service';
import { CheckMissionDialogComponent } from '../check-mission-dialog/check-mission-dialog.component';

@Component({
  selector: 'app-alertes-missions',
  templateUrl: './alertes-missions.component.html',
  styleUrl: './alertes-missions.component.css'
})

export class AlertesMissionsComponent implements OnInit {
  accptedMissions: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();  // Initialized with an empty data source
  filterForm: FormGroup;
  logedEmploye!: User;
  errorMessageDoneFilter: string | null = null;
  displayedColumns = ["reference", "destination","dateDebut", "dateFin","responsable","chauffeur","accompagnants","affectation","actions"];
  typeAlertes!: string[];
  matricules!: string[];
  severities = Object.values(SeverityLevel);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authenticationService : AuthenticationService,
    private notificationService: NotificationService,
    private aulshService: AulshService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      typeAlerte: [''],
      matricule: [''],
      severity: [''],
    });
  }

  ngOnInit(): void {
    const authenticatedUser = this.authenticationService.authenticatedUserDetails;
    if (authenticatedUser) {
      this.logedEmploye = authenticatedUser;
      const departementId = this.logedEmploye.departement?.id;
      if (departementId !== undefined) {
        this.loadNotifications(departementId);
      }
    }


    this.aulshService.getAllTypeAlertes().subscribe({
      next: (typeAlertes) => {
        this.typeAlertes = typeAlertes;
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.aulshService.getAllAlertesMatricules().subscribe({
      next: (matricules) => {
        this.matricules = matricules;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o && o[p] ? o[p] : ''), obj);
  }

  onSearch(): void {
    const filterValues = this.filterForm.value;
    this.errorMessageDoneFilter = null; // Reset error message
    this.dataSource.data = []; // Clear previous data

    this.aulshService.filterAlertesDone(filterValues).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        this.errorMessageDoneFilter = err.message;
      },
    });
  }

  loadNotifications(departementId: number): void {
    this.aulshService.getAlertesOfMissionAcceptedByDepartement(departementId).subscribe({
      next: (value) => {
        this.accptedMissions = value;
        this.dataSource = new MatTableDataSource<any>(this.accptedMissions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: any, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  CheckDialog(mission: Mission): void {
    const dialogRef = this.dialog.open(CheckMissionDialogComponent, {
      data: {
        missiondata : mission
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const authenticatedUser = this.authenticationService.authenticatedUserDetails;
        if (authenticatedUser) {
          this.logedEmploye = authenticatedUser;
          const departementId = this.logedEmploye.departement?.id;
          if (departementId !== undefined) {
            this.loadNotifications(departementId);
          }
        }
      }
    });
  }
  
}
