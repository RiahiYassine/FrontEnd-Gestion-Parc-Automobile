import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AulshService } from '../services/aulsh.service';
import { AlerteStatus, SeverityLevel } from '../model/vehicule.model';
import { AjouterAlerteDialogComponent } from '../ajouter-alerte-dialog/ajouter-alerte-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationFinishDialogComponent } from '../confirmation-finish-dialog/confirmation-finish-dialog.component';
import { ModifierAlerteDialogComponent } from '../modifier-alerte-dialog/modifier-alerte-dialog.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent  implements OnInit {

  finishedAlertes: any[] = [];
  alertesEnCour: any[] = []; 
  dataSource!: MatTableDataSource<any>;
  dataSourceEnCour!: MatTableDataSource<any>;
  filterForm: FormGroup;
  errorMessageDoneFilter: string | null = null;
  errorMessageEnCourFilter: string | null = null;
  displayedColumns = ["typeAlerte", "message", "matricule", "disponibilite", "createdAt", "dateReminder", "kilometrage", "severity", "actions"];
  typeAlertes!: string[];
  matricules!: string[];
  severities = Object.values(SeverityLevel)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private notificationService: NotificationService, private aulshService : AulshService, private fb: FormBuilder,public dialog : MatDialog,private snackBar: MatSnackBar) { 
    this.filterForm = this.fb.group({
      typeAlerte: [''],
      matricule: [''],
      severity : [''],
    });
  }

  ngOnInit(): void {
    this.loadNotifications();

    this.aulshService.getAllTypeAlertes().subscribe({
      next: typeAlertes => {
        this.typeAlertes = typeAlertes;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllAlertesMatricules().subscribe({
      next: matricules => {
        this.matricules = matricules;
      },
      error: err => {
        console.log(err);
      }
    });


  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p] ? o[p] : '', obj);
  }

  onSearch(): void {
    const filterValues = this.filterForm.value;
    this.errorMessageDoneFilter = null; // Reset error message
    this.errorMessageEnCourFilter = null;
    this.dataSource.data = []; // Clear previous data

    this.aulshService.filterAlertesDone(filterValues).subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        this.errorMessageDoneFilter = err.message;
      }
    });

    this.aulshService.filterAlertesEnCour(filterValues).subscribe({
      next: data => {
        this.dataSourceEnCour.data = data;
      },
      error: err => {
        this.errorMessageEnCourFilter = err.message;
      }
    });
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

  loadNotifications(): void {
    this.aulshService.getFinishedAlertes(AlerteStatus.DONE).subscribe({
      next: value => {
        this.finishedAlertes = value;
        this.dataSource = new MatTableDataSource<any>(this.finishedAlertes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: any, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });


    this.aulshService.getAlertesEnCour(AlerteStatus.NOT_DONE).subscribe({
      next: value => {
        this.alertesEnCour = value;
        this.dataSourceEnCour = new MatTableDataSource<any>(this.alertesEnCour);
        this.dataSourceEnCour.paginator = this.paginator;
        this.dataSourceEnCour.sortingDataAccessor = (obj: any, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSourceEnCour.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });

  }


  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterAlerteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.alertesEnCour.push(result);
        this.dataSourceEnCour.data = this.alertesEnCour;
      }
    });
  }


  deleteAlerte(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteAlerte(id).subscribe({
          next: () => {
            
            this.snackBar.open('Alerte deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadNotifications();
          },
          error: err => {
            console.error('Error deleting alerte', err);
            this.snackBar.open('Error deleting alerte', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }


  finishAlerte(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationFinishDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.finishAlerte(id).subscribe({
          next: () => {
            
            this.snackBar.open('done', 'Close', {
              duration: 3000
            });
            this.loadNotifications();
          },
          error: err => {
            console.error('Error', err);
            this.snackBar.open('Error', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }


  openDialogModifier(alerte: any) {
    const dialogRef = this.dialog.open(ModifierAlerteDialogComponent, {
      data: alerte
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadNotifications();
      }
    });
  }

}
