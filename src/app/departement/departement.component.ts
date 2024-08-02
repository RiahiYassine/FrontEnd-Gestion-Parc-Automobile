import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AulshService } from '../services/aulsh.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Departement, User } from '../model/vehicule.model';
import { AjouterDepartementDialogComponent } from '../ajouter-departement-dialog/ajouter-departement-dialog.component';
import { ModifierDepartementDialogComponent } from '../modifier-departement-dialog/modifier-departement-dialog.component';

@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrl: './departement.component.css'
})
export class DepartementComponent implements OnInit {

  departements: Departement[] = [];
  dataSource!: MatTableDataSource<Departement>;
  errorMessage: string | null = null;
  selectedDepartement: Departement | null = null;
  employeeDataSource!: MatTableDataSource<User>;


  displayedColumns = ["libelle", "description","cin","nom", "prenom","actions"];

  displayedColumnsEmployes = ["cin", "nom","prenom","email","grade"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private aulshService: AulshService, public dialog : MatDialog,private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.loadDepartements();
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


  

  openDialogModifier(departement: any) {
    const dialogRef = this.dialog.open(ModifierDepartementDialogComponent, {
      data: departement
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartements();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterDepartementDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDepartements();
      }
    });
  }


  loadDepartements(): void {
    this.aulshService.getAllDepartements().subscribe({
      next: value => {
        this.departements = value;
        this.dataSource = new MatTableDataSource<Departement>(this.departements);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: Departement, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

  deleteDepartement(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteDepartement(id).subscribe({
          next: () => {
            
            this.snackBar.open('Departement deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadDepartements();
          },
          error: err => {
            console.error('Error deleting departement', err);
            this.snackBar.open('Error deleting departement', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }


  consultDepartement(departement: Departement): void {
    this.selectedDepartement = departement;
    this.aulshService.getEmployesByDepartementId(departement.id).subscribe({
      next: employes => {
        this.employeeDataSource = new MatTableDataSource<User>(employes);
      },
      error: err => {
        console.error('Error loading employees', err);
        this.snackBar.open('Error loading employees', 'Close', {
          duration: 3000
        });
      }
    });
  }

}