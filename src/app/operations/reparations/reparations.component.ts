import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Reparation, TypeImmatriculation, TypeOperation } from '../../model/vehicule.model';
import { AulshService } from '../../services/aulsh.service'; 
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { saveAs } from 'file-saver';
import { ModifierReparationDialogComponent } from '../modifier-reparation-dialog/modifier-reparation-dialog.component';
import { AjouterReparationDialogComponent } from '../ajouter-reparation-dialog/ajouter-reparation-dialog.component';


@Component({
  selector: 'app-reparations',
  templateUrl: './reparations.component.html',
  styleUrl: './reparations.component.css'
})
export class ReparationsComponent implements OnInit {

  reparations: Reparation[] = [];
  dataSource!: MatTableDataSource<Reparation>;
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
    this.loadReparations();


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
    this.aulshService.filterReparations(filterValues).subscribe({
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
    const dialogRef = this.dialog.open(ModifierReparationDialogComponent, {
      data: reparation
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReparations();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterReparationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReparations();
      }
    });
  }


  loadReparations(): void {
    this.aulshService.getAllReparations(TypeOperation.REPARATION).subscribe({
      next: value => {
        console.log(value);
        this.reparations = value;
        this.dataSource = new MatTableDataSource<Reparation>(this.reparations);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: Reparation, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

  deleteReparation(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteReparation(id).subscribe({
          next: () => {
            
            this.snackBar.open('Réparation supprimée avec succès', 'Close', {
              duration: 3000
            });
            this.loadReparations();
          },
          error: err => {
            console.error('Erreur lors de la suppression de la réparation', err);
            this.snackBar.open('Erreur lors de la suppression de la réparation', 'Close', {
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
        saveAs(blob, `Reparation${reparationId}.pdf`);
      },
      error: err => {
        console.error('Erreur lors du téléchargement du fichier', err);
      }
    });
  }

}