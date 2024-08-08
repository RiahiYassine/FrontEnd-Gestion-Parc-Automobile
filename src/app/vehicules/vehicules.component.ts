import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategorieVehicule, StatusVehicule, TypeCarburant, TypeImmatriculation, TypeTransmission, Vehicule } from '../model/vehicule.model';
import { AulshService } from '../services/aulsh.service';
import { AjouterVehiculeDialogComponent } from '../ajouter-vehicule-dialog/ajouter-vehicule-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ModifierVehiculeDialogComponent } from '../modifier-vehicule-dialog/modifier-vehicule-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-vehicules',
  templateUrl: './vehicules.component.html',
  styleUrls: ['./vehicules.component.css']
})
export class VehiculesComponent implements OnInit {
  vehicules: Vehicule[] = [];
  dataSource!: MatTableDataSource<Vehicule>;
  filterForm: FormGroup;
  errorMessage: string | null = null;

  displayedColumns = ["immatriculation","dateEntree" , "nomMarque", "nomModele", "typeImmatriculation", "typeCarburant", "statusVehicule","categorieVehicule","typeTransmission", "update","delete"];

  typeCarburantOptions = Object.values(TypeCarburant);
  typeImmatriculationOptions = Object.values(TypeImmatriculation);
  statusVehicules = Object.values(StatusVehicule);
  categorieVehicules = Object.values(CategorieVehicule);
  typeTransmissions = Object.values(TypeTransmission)

  immatriculations!: string[];
  marques!: string[];
  modeles!: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private aulshService: AulshService, private fb: FormBuilder,public dialog : MatDialog,private snackBar: MatSnackBar) {
    this.filterForm = this.fb.group({
      immatriculation: [''],
      typeImmatriculation: [''],
      marque: [''],
      modele: [''],
      typeCarburant: [''],
      statusVehicule: [''],
      categorieVehicule:[''],
      typeTransmission:[''],
      dateEntree : [''],
    });
  }

  ngOnInit(): void {
    this.aulshService.getAllVehicules().subscribe({
      next: value => {
        this.vehicules = value;
        this.dataSource = new MatTableDataSource<Vehicule>(this.vehicules);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: Vehicule, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllImmatriculations().subscribe({
      next: immatriculations => {
        this.immatriculations = immatriculations;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllMarques().subscribe({
      next: marques => {
        this.marques = marques;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllModeles().subscribe({
      next: modeles => {
        this.modeles = modeles;
      },
      error: err => {
        console.log(err);
      }
    });
  }


  onSearch(): void {
    const filterValues = this.filterForm.value;
    this.errorMessage = null; // Reset error message
    this.dataSource.data = []; // Clear previous data

    this.aulshService.filterVehicules(filterValues).subscribe({
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


  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterVehiculeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result of the dialog, e.g., add the new vehicule to the list
        this.vehicules.push(result);
        this.dataSource.data = this.vehicules; // Refresh the data source
      }
    });
  }

  openDialogModifier(vehicule: any) {
    const dialogRef = this.dialog.open(ModifierVehiculeDialogComponent, {
      data: vehicule
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.vehicules.findIndex(v => v.id === result.id);
        if (index !== -1) {
          this.vehicules[index] = result;
          this.dataSource.data = this.vehicules;
        }
      }
    });
  }

  deleteVehicule(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteVehicule(id).subscribe({
          next: () => {
            this.vehicules = this.vehicules.filter(vehicule => vehicule.id !== id);
            this.dataSource.data = this.vehicules;
            this.snackBar.open('Vehicule deleted successfully', 'Close', {
              duration: 3000
            });
          },
          error: err => {
            console.error('Error deleting vehicle', err);
            this.snackBar.open('Error deleting vehicle', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }
  

}
