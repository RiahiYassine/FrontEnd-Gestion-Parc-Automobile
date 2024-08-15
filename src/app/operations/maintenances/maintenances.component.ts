import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategorieMaintenance, Maintenance, TypeImmatriculation, TypeOperation } from '../../model/vehicule.model';
import { AulshService } from '../../services/aulsh.service'; 
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ModifierMaintenanceDialogComponent } from '../modifier-maintenance-dialog/modifier-maintenance-dialog.component';
import { AjouterMaintenanceDialogComponent } from '../ajouter-maintenance-dialog/ajouter-maintenance-dialog.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-maintenances',
  templateUrl: './maintenances.component.html',
  styleUrl: './maintenances.component.css'
})
export class MaintenancesComponent implements OnInit {

  maintenances: Maintenance[] = [];
  dataSource!: MatTableDataSource<Maintenance>;
  filterForm: FormGroup;
  errorMessage: string | null = null;

  displayedColumns = ["typeOperation", "vehicule","categorieMaintenance","nomCentre", "dateOperation","cout","actions"];

  typeImmatriculationOptions = Object.values(TypeImmatriculation);
  categorieMaintenancesOptions = Object.values(CategorieMaintenance);

  immatriculations!: string[];
  marques!: string[];
  modeles!: string[];
  centres!: string[];
  typeCarburantOptions!:string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private aulshService: AulshService, private fb: FormBuilder,public dialog : MatDialog,private snackBar: MatSnackBar) {
    this.filterForm = this.fb.group({
      immatriculation: [''],
      typeImmatriculation: [''],
      marque: [''],
      modele: [''],
      typeCarburant: [''],
      centre: [''],
      categorieMaintenance:[''],
    });
  }

  ngOnInit(): void {
    this.loadMaintenances();


    this.aulshService.getAllImmatriculationsByTypeOperations(TypeOperation.MAINTENANCE).subscribe({
      next: immatriculations => {
        this.immatriculations = immatriculations;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllMarquesByTypeOperations(TypeOperation.MAINTENANCE).subscribe({
      next: marques => {
        this.marques = marques;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllModelesByTypeOperations(TypeOperation.MAINTENANCE).subscribe({
      next: modeles => {
        this.modeles = modeles;
      },
      error: err => {
        console.log(err);
      }
    });
    

    this.aulshService.getAllCentres(TypeOperation.MAINTENANCE).subscribe({
      next: centres => {
        this.centres = centres;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllCarburantsByTypeOperations(TypeOperation.MAINTENANCE).subscribe({
      next: typeCarburantOptions => {
        this.typeCarburantOptions = typeCarburantOptions;
      },
      error: err => {
        console.log(err);
      }
    });

  }


  onSearch(): void {
    const filterValues = this.filterForm.value;
    this.errorMessage = null;
    this.dataSource.data = [];
+
    this.aulshService.filterMaintenances(filterValues).subscribe({
      next: data => {
        this.dataSource.data = data;
      },
      error: err => {
        this.errorMessage = err.message;
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


  

  openDialogModifier(reparation: any) {
    const dialogRef = this.dialog.open(ModifierMaintenanceDialogComponent, {
      data: reparation
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMaintenances();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterMaintenanceDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMaintenances();
      }
    });
  }


  loadMaintenances(): void {
    this.aulshService.getAllMaintenances(TypeOperation.MAINTENANCE).subscribe({
      next: value => {
        this.maintenances = value;
        this.dataSource = new MatTableDataSource<Maintenance>(this.maintenances);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: Maintenance, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

  deleteMaintenance(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteMaintenance(id).subscribe({
          next: () => {
            
            this.snackBar.open('Maintenance supprimée avec succès', 'Close', {
              duration: 3000
            });
            this.loadMaintenances();
          },
          error: err => {
            console.error('Erreur lors de la suppression de la maintenance', err);
            this.snackBar.open('Erreur lors de la suppression de la maintenance', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }
  
  downloadFile(maintenanceId: number): void {
    this.aulshService.downloadFile(maintenanceId).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(blob, `Maintenance${maintenanceId}.pdf`);
      },
      error: err => {
        console.error('Erreur lors du téléchargement du fichier', err);
      }
    });
  }

}


