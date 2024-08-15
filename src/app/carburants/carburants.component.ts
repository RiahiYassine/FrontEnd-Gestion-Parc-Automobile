import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Carburant, TypeImmatriculation, TypeOperation } from '../model/vehicule.model';
import { AulshService } from '../services/aulsh.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { saveAs } from 'file-saver';
import { AjouterCarburantDialogComponent } from '../ajouter-carburant-dialog/ajouter-carburant-dialog.component';
import { ModifierCarburantDialogComponent } from '../modifier-carburant-dialog/modifier-carburant-dialog.component';


@Component({
  selector: 'app-carburants',
  templateUrl: './carburants.component.html',
  styleUrl: './carburants.component.css'
})
export class CarburantsComponent implements OnInit {

  carburants: Carburant[] = [];
  dataSource!: MatTableDataSource<Carburant>;
  filterForm: FormGroup;
  errorMessage: string | null = null;

  displayedColumns = ["typeOperation", "vehicule","nomCentre", "dateOperation","cout","actions"];

  typeImmatriculationOptions = Object.values(TypeImmatriculation);

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
    });
  }

  ngOnInit(): void {
    this.loadCarburants();


    this.aulshService.getAllImmatriculationsByTypeOperations(TypeOperation.REPARATION).subscribe({
      next: immatriculations => {
        this.immatriculations = immatriculations;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllMarquesByTypeOperations(TypeOperation.REPARATION).subscribe({
      next: marques => {
        this.marques = marques;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllModelesByTypeOperations(TypeOperation.REPARATION).subscribe({
      next: modeles => {
        this.modeles = modeles;
      },
      error: err => {
        console.log(err);
      }
    });
    

    this.aulshService.getAllCentres(TypeOperation.REPARATION).subscribe({
      next: centres => {
        this.centres = centres;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllCarburantsByTypeOperations(TypeOperation.REPARATION).subscribe({
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
    this.aulshService.filterCarburants(filterValues).subscribe({
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
    const dialogRef = this.dialog.open(ModifierCarburantDialogComponent, {
      data: reparation
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCarburants();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterCarburantDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCarburants();
      }
    });
  }


  loadCarburants(): void {
    this.aulshService.getAllCarburants(TypeOperation.CARBURANT).subscribe({
      next: value => {
        console.log(value);
        this.carburants = value;
        this.dataSource = new MatTableDataSource<Carburant>(this.carburants);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: Carburant, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

  deleteCarburant(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteCarburant(id).subscribe({
          next: () => {
            
            this.snackBar.open('Carburant supprimé avec succès', 'Close', {
              duration: 3000
            });
            this.loadCarburants();
          },
          error: err => {
            console.error(' ', err);
            this.snackBar.open('Erreur lors de la suppression du carburant', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }
  
  downloadFile(reparationId: number): void {
    this.aulshService.downloadFile(reparationId).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(blob, `Carburant${reparationId}.pdf`);
      },
      error: err => {
        console.error('Erreur lors du téléchargement du fichier', err);
      }
    });
  }

}
