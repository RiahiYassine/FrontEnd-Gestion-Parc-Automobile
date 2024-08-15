import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Assurance, Mission, Status } from '../model/vehicule.model';
import { AulshService } from '../services/aulsh.service'; 
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { RescheduleDialogComponent } from '../reschedule-dialog/reschedule-dialog.component';
import { AjouterAssuranceDialogComponent } from '../operations/ajouter-assurance-dialog/ajouter-assurance-dialog.component';
import { TraiterDialogComponent } from '../traiter-dialog/traiter-dialog.component';
import { ConsulterMissionDialogComponent } from '../consulter-mission-dialog/consulter-mission-dialog.component';
import { CheckMissionDialogComponent } from '../check-mission-dialog/check-mission-dialog.component';


@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.css'
})
export class MissionComponent implements OnInit {

  missions: Mission[] = [];
  missionsAccepter: Mission[] = [];
  missionsRefuser: Mission[] = [];

  dataSource!: MatTableDataSource<Mission>;
  dataSourceAccepter!: MatTableDataSource<Mission>;
  dataSourceRefuser!: MatTableDataSource<Mission>;

  filterForm: FormGroup;
  errorMessageFilter: string | null = null;
  errorMessageFilterAccepter: string | null = null;
  errorMessageFilterRefuser: string | null = null;

  displayedColumns = ["reference", "destination", "departement","dateDebut", "dateFin","chauffeur","accompagnants","affectation","actions"];


  listreference! : string[]
  listdestination! : string[]
  listmatricule! : string[]
  listdepartement! : string[]
  listStatus = Object.values(Status);
  listchauffeur! : string[] //nom+prenom
  listresponsable! : string[]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private aulshService: AulshService, private fb: FormBuilder,public dialog : MatDialog,private snackBar: MatSnackBar) {
    this.filterForm = this.fb.group({
      reference: [''],
      destination: [''],
      status: [''],
      matricule: [''],
      chauffeur: [''],
      responsable: [''],
      departement: [''],
    });
  }

  ngOnInit(): void {
    this.loadMissions();


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
    this.errorMessageFilterAccepter = null;
    this.errorMessageFilterRefuser = null;
    this.dataSource.data = [];
    this.dataSourceAccepter.data = [];
    this.dataSourceRefuser.data = [];

    this.aulshService.filterMission(filterValues).subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        this.errorMessageFilter = err.message;
      }
    });


    this.aulshService.filterMissionAccepter(filterValues).subscribe({
      next: data => {
        this.dataSourceAccepter.data = data;
      },
      error: err => {
        this.errorMessageFilterAccepter = err.message;
      }
    });



    this.aulshService.filterMissionRefuser(filterValues).subscribe({
      next: data => {
        this.dataSourceRefuser.data = data;
      },
      error: err => {
        this.errorMessageFilterRefuser = err.message;
      }
    });


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
    const dialogRef = this.dialog.open(AjouterAssuranceDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMissions();
      }
    });
  }

  openRescheduleDialog(assurance: Assurance): void {
    const dialogRef = this.dialog.open(RescheduleDialogComponent, {
      data: { assurance: assurance }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.aulshService.rescheduleExpiredAssuranceById(assurance.id).subscribe({
          next: () => {
            this.snackBar.open('Assurance rescheduled successfully', 'Close', {
              duration: 3000
            });

            this.loadMissions();

          },
          error: err => {
            this.snackBar.open('Error rescheduling assurance', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }


  loadMissions(): void {
    this.aulshService.getAllMissions().subscribe({
      next: value => {
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


    this.aulshService.getAllMissionsAccepter().subscribe({
      next: value => {
        this.missionsAccepter = value;
        this.dataSourceAccepter = new MatTableDataSource<Mission>(this.missionsAccepter);
        this.dataSourceAccepter.paginator = this.paginator;
        this.dataSourceAccepter.sortingDataAccessor = (obj: Mission, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSourceAccepter.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });


    this.aulshService.getAllMissionsRefuser().subscribe({
      next: value => {
        this.missionsRefuser = value;
        this.dataSourceRefuser = new MatTableDataSource<Mission>(this.missionsRefuser);
        this.dataSourceRefuser.paginator = this.paginator;
        this.dataSourceRefuser.sortingDataAccessor = (obj: Mission, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSourceRefuser.sort = this.sort;
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
            
            this.snackBar.open('Assurance supprimée avec succès', 'Close', {
              duration: 3000
            });
            this.loadMissions();
          },
          error: err => {
            console.error("Erreur lors de la suppression de l'assurance", err);
            this.snackBar.open("Erreur lors de la suppression de l'assurance", 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  openTraiterDialog(mission: Mission): void {
    const dialogRef = this.dialog.open(TraiterDialogComponent, {
      width: '400px',
      data: { 
        id: mission.affectation.id,
        dateDebut:mission.dateDebut,
        dateFin:mission.dateFin
      
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMissions();
      }
    });
  }

  
  consulterDialog(mission: Mission): void {
    const dialogRef = this.dialog.open(ConsulterMissionDialogComponent, {
      width: '400px',
      data: {
        missiondata : mission
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMissions();
      }
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
        this.loadMissions();
      }
    });
  }

}


