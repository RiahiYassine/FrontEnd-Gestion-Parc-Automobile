import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VisiteTechnique, TypeImmatriculation, TypeOperation } from '../../model/vehicule.model';
import { AulshService } from '../../services/aulsh.service'; 
import { MatDialog } from '@angular/material/dialog';
import { ModifierVehiculeDialogComponent } from '../../modifier-vehicule-dialog/modifier-vehicule-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { RescheduleDialogComponent } from '../../reschedule-dialog/reschedule-dialog.component';
import { AjouterAssuranceDialogComponent } from '../ajouter-assurance-dialog/ajouter-assurance-dialog.component';
import { ModifierVisiteTechniqueDialogComponent } from '../modifier-visite-technique-dialog/modifier-visite-technique-dialog.component';
import { AjouterVisiteTechniqueDialogComponent } from '../ajouter-visite-technique-dialog/ajouter-visite-technique-dialog.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-visitetechniques',
  templateUrl: './visitetechniques.component.html',
  styleUrl: './visitetechniques.component.css'
})
export class VISITETECHNIQUESComponent implements OnInit {

  visiteTechniques: VisiteTechnique[] = [];
  dataSourceExpired!: MatTableDataSource<VisiteTechnique>;
  dataSourceActive!: MatTableDataSource<VisiteTechnique>;
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
    this.loadVisiteTechniques();


    this.aulshService.getAllImmatriculationsByTypeOperations(TypeOperation.VISITE_TECHNIQUE).subscribe({
      next: immatriculations => {
        this.immatriculations = immatriculations;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllMarquesByTypeOperations(TypeOperation.VISITE_TECHNIQUE).subscribe({
      next: marques => {
        this.marques = marques;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllModelesByTypeOperations(TypeOperation.VISITE_TECHNIQUE).subscribe({
      next: modeles => {
        this.modeles = modeles;
      },
      error: err => {
        console.log(err);
      }
    });
    

    this.aulshService.getAllCentres(TypeOperation.VISITE_TECHNIQUE).subscribe({
      next: centres => {
        this.centres = centres;
      },
      error: err => {
        console.log(err);
      }
    });

    this.aulshService.getAllCarburantsByTypeOperations(TypeOperation.VISITE_TECHNIQUE).subscribe({
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

    this.aulshService.filterVisiteTechniquesExpired(filterValues).subscribe({
      next: data => {
        this.dataSourceExpired.data = data;
      },
      error: err => {
        this.errorMessageExpiredFilter = err.message;
      }
    });

    this.aulshService.filterVisiteTechniqueActive(filterValues).subscribe({
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


  

  openDialogModifier(visiteTechnique: any) {
    const dialogRef = this.dialog.open(ModifierVisiteTechniqueDialogComponent, {
      data: visiteTechnique
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVisiteTechniques();
      }
    });
  }




  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterVisiteTechniqueDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVisiteTechniques();
      }
    });
  }

  


  loadVisiteTechniques(): void {
    this.aulshService.getAllVisiteTechniquesExpired(TypeOperation.VISITE_TECHNIQUE).subscribe({
      next: value => {
        console.log(value);
        this.visiteTechniques = value;
        this.dataSourceExpired = new MatTableDataSource<VisiteTechnique>(this.visiteTechniques);
        this.dataSourceExpired.paginator = this.paginator;
        this.dataSourceExpired.sortingDataAccessor = (obj: VisiteTechnique, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSourceExpired.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });


    this.aulshService.getAllVisiteTechniquesActive(TypeOperation.VISITE_TECHNIQUE).subscribe({
      next: value => {
        this.visiteTechniques = value;
        this.dataSourceActive = new MatTableDataSource<VisiteTechnique>(this.visiteTechniques);
        this.dataSourceActive.paginator = this.paginator;
        this.dataSourceActive.sortingDataAccessor = (obj: VisiteTechnique, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSourceActive.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

  openRescheduleDialog(visiteTechnique: VisiteTechnique): void {
    const dialogRef = this.dialog.open(RescheduleDialogComponent, {
      data: { visiteTechnique: visiteTechnique }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.aulshService.rescheduleExpiredVisiteTechniqueById(visiteTechnique.id).subscribe({
          next: () => {
            this.snackBar.open('Visite technique replanifiée avec succès.', 'Close', {
              duration: 3000
            });

            this.loadVisiteTechniques();

          },
          error: err => {
            this.snackBar.open('Erreur lors de la replanification de la visite technique', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }


  deleteVisiteTechnique(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteVisiteTechnique(id).subscribe({
          next: () => {
            
            this.snackBar.open('Visite technique deleted successfully.', 'Close', {
              duration: 3000
            });
            this.loadVisiteTechniques();
          },
          error: err => {
            console.error('Erreur lors de la suppression de la visite technique', err);
            this.snackBar.open('Erreur lors de la suppression de la visite technique', 'Close', {
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
        saveAs(blob, `VisiteTechnique${assuranceId}.pdf`);
      },
      error: err => {
        console.error('Erreur lors du téléchargement du fichier', err);
      }
    });
  }

}

