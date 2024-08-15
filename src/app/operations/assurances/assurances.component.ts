import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Assurance, TypeCarburant, TypeImmatriculation, TypeOperation } from '../../model/vehicule.model';
import { AulshService } from '../../services/aulsh.service'; 
import { MatDialog } from '@angular/material/dialog';
import { ModifierVehiculeDialogComponent } from '../../modifier-vehicule-dialog/modifier-vehicule-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { RescheduleDialogComponent } from '../../reschedule-dialog/reschedule-dialog.component';
import { AjouterAssuranceDialogComponent } from '../ajouter-assurance-dialog/ajouter-assurance-dialog.component';
import { saveAs } from 'file-saver';
import { ModifierAssuranceDialogComponent } from '../modifier-assurance-dialog/modifier-assurance-dialog.component';

@Component({
  selector: 'app-assurances',
  templateUrl: './assurances.component.html',
  styleUrl: './assurances.component.css'
})
export class AssurancesComponent implements OnInit {

  assurances: Assurance[] = [];
  dataSourceExpired!: MatTableDataSource<Assurance>;
  dataSourceActive!: MatTableDataSource<Assurance>;
  filterForm: FormGroup;
  errorMessageExpiredFilter: string | null = null;
  errorMessageValideFilter: string | null = null;

  displayedColumns = ["typeOperation", "vehicule","nomCentre", "dateOperation", "dateFinValidite","cout","actions"];
  displayedColumnsExpired = ["typeOperation", "vehicule","nomCentre", "dateOperation", "dateFinValidite","cout","actions"];


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
    this.loadAssurances();


    this.aulshService.getAllImmatriculationsByTypeOperations(TypeOperation.ASSURANCE).subscribe({
      next: immatriculations => {
        this.immatriculations = immatriculations;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllMarquesByTypeOperations(TypeOperation.ASSURANCE).subscribe({
      next: marques => {
        this.marques = marques;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllModelesByTypeOperations(TypeOperation.ASSURANCE).subscribe({
      next: modeles => {
        this.modeles = modeles;
      },
      error: err => {
        console.log(err);
      }
    });
    

    this.aulshService.getAllCentres(TypeOperation.ASSURANCE).subscribe({
      next: centres => {
        this.centres = centres;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllCarburantsByTypeOperations(TypeOperation.ASSURANCE).subscribe({
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
    this.errorMessageExpiredFilter = null;
    this.errorMessageValideFilter = null;
    this.dataSourceExpired.data = [];
    this.dataSourceActive.data = [];

    this.aulshService.filterAssurancesExpired(filterValues).subscribe({
      next: data => {
        this.dataSourceExpired.data = data;
      },
      error: err => {
        this.errorMessageExpiredFilter = err.message;
      }
    });

    this.aulshService.filterAssurancesActive(filterValues).subscribe({
      next: data => {
        this.dataSourceActive.data = data;
      },
      error: err => {
        this.errorMessageValideFilter = err.message;
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


  

  openDialogModifier(assurance: any) {
    const dialogRef = this.dialog.open(ModifierAssuranceDialogComponent, {
      data: assurance
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAssurances();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterAssuranceDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAssurances();
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
            this.snackBar.open('Assurance replanifiée avec succès', 'Close', {
              duration: 3000
            });

            this.loadAssurances();

          },
          error: err => {
            this.snackBar.open("Erreur lors de la replanification de l'assurance", 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }


  loadAssurances(): void {
    this.aulshService.getAllAssurancesExpired(TypeOperation.ASSURANCE).subscribe({
      next: value => {
        console.log(value);
        this.assurances = value;
        this.dataSourceExpired = new MatTableDataSource<Assurance>(this.assurances);
        this.dataSourceExpired.paginator = this.paginator;
        this.dataSourceExpired.sortingDataAccessor = (obj: Assurance, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSourceExpired.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });


    this.aulshService.getAllAssurancesActive(TypeOperation.ASSURANCE).subscribe({
      next: value => {
        console.log(value);
        this.assurances = value;
        this.dataSourceActive = new MatTableDataSource<Assurance>(this.assurances);
        this.dataSourceActive.paginator = this.paginator;
        this.dataSourceActive.sortingDataAccessor = (obj: Assurance, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSourceActive.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

  deleteAssurance(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteAssurance(id).subscribe({
          next: () => {
            
            this.snackBar.open('Assurance supprimée avec succès', 'Close', {
              duration: 3000
            });
            this.loadAssurances();
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
  
  downloadFile(assuranceId: number): void {
    this.aulshService.downloadFile(assuranceId).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        saveAs(blob, `assurance${assuranceId}.pdf`);
      },
      error: err => {
        console.error('Erreur lors du téléchargement du fichier', err);
      }
    });
  }

}

