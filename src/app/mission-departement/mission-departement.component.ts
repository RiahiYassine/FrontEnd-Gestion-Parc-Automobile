import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Affectation, Assurance, Departement, Mission, Status, TypeCarburant, TypeImmatriculation, TypeOperation, User } from '../model/vehicule.model';
import { AulshService } from '../services/aulsh.service'; 
import { MatDialog } from '@angular/material/dialog';
import { ModifierVehiculeDialogComponent } from '../modifier-vehicule-dialog/modifier-vehicule-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { RescheduleDialogComponent } from '../reschedule-dialog/reschedule-dialog.component';
import { AjouterAssuranceDialogComponent } from '../operations/ajouter-assurance-dialog/ajouter-assurance-dialog.component';
import { TraiterDialogComponent } from '../traiter-dialog/traiter-dialog.component';
import { AjouterMissionDialogComponent } from '../ajouter-mission-dialog/ajouter-mission-dialog.component';
import { AuthenticationService } from '../services/authentication.service';
import { ModifierMissionDialogComponent } from '../modifier-mission-dialog/modifier-mission-dialog.component';
@Component({
  selector: 'app-mission-departement',
  templateUrl: './mission-departement.component.html',
  styleUrl: './mission-departement.component.css'
})
export class MissionDepartementComponent implements OnInit {

  missions: Mission[] = [];
  dataSource!: MatTableDataSource<Mission>;
  filterForm: FormGroup;
  logedEmploye! : User;
  errorMessageFilter: string | null = null;

  displayedColumns = ["reference", "destination", "departement","dateDebut", "dateFin","dateOrder","chauffeur","accompagnants","affectation","actions"];


  listreference! : string[]
  listdestination! : string[]
  listmatricule! : string[]
  listdepartement! : string[]
  listStatus = Object.values(Status);
  listchauffeur! : string[] //nom+prenom
  listresponsable! : string[]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authenticationService : AuthenticationService,private aulshService: AulshService, private fb: FormBuilder,public dialog : MatDialog,private snackBar: MatSnackBar) {
    this.filterForm = this.fb.group({
      reference: [''],
      destination: [''],
      status: [''],
      matricule: [''],
      chauffeur: [''],
      responsable: [''],
    });
  }

  ngOnInit(): void {
    const authenticatedUser = this.authenticationService.authenticatedUserDetails;
    if (authenticatedUser) {
      this.logedEmploye = authenticatedUser;
      const departementId = this.logedEmploye.departement?.id;
      if (departementId !== undefined) {
        this.loadMissions(departementId);
      }
    }

    this.aulshService.getAllReferences().subscribe({
      next: listreference => {
        this.listreference = listreference;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllDestinations().subscribe({
      next: listdestination => {
        this.listdestination = listdestination;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllMatricules().subscribe({
      next: listmatricule => {
        this.listmatricule = listmatricule;
      },
      error: err => {
        console.log(err);
      }
    });
    

    this.aulshService.getAllDepartementlibelle().subscribe({
      next: listdepartement => {
        this.listdepartement = listdepartement;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllResponsable().subscribe({
      next: listresponsable => {
        this.listresponsable = listresponsable;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllChauffeur().subscribe({
      next: listchauffeur => {
        this.listchauffeur = listchauffeur;
      },
      error: err => {
        console.log(err);
      }
    });

  }


  onSearch(): void {
    const filterValues = this.filterForm.value;
    this.errorMessageFilter = null;
    this.dataSource.data = [];

    const departementId = this.logedEmploye.departement?.id;
    if (departementId !== undefined) {
      this.aulshService.filterMissionDepartement(departementId,filterValues).subscribe({
        next: data => {
          this.dataSource.data = data;
        },
        error: err => {
          this.errorMessageFilter = err.message;
        }
      });
    }

    

  }
  

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p] ? o[p] : '', obj);
  }

  private convertToSortable(value: any): string | number {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    } else if (value instanceof Date) {
      return value.getTime();
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value ?? '';
  }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterMissionDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const departementId = this.logedEmploye.departement?.id;
        if (departementId !== undefined) {
          this.loadMissions(departementId);
        }
      }
    });
  }
  



  loadMissions(departementId: number): void {
    this.aulshService.getAllMissionsByDepartement(departementId).subscribe({
      next: value => {
        console.log(value);
        this.missions = value;
        this.dataSource = new MatTableDataSource<Mission>(this.missions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: Mission, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });

  }
  

  deleteMission(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteAssurance(id).subscribe({
          next: () => {
            this.snackBar.open('Assurance deleted successfully', 'Close', {
              duration: 3000
            });
  
            const departementId = this.logedEmploye.departement?.id;
            if (departementId !== undefined) {
              this.loadMissions(departementId);
            }
          },
          error: err => {
            console.error('Error deleting assurance', err);
            this.snackBar.open('Error deleting assurance', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }
  

  openModifierDialog(mission: any) {
    const dialogRef = this.dialog.open(ModifierMissionDialogComponent, {
      data: mission
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const departementId = this.logedEmploye.departement?.id;
        if (departementId !== undefined) {
          this.loadMissions(departementId);
        }
      }
    });
  }


}



