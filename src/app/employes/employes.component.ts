import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AulshService } from '../services/aulsh.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Grade, User } from '../model/vehicule.model';
import { AuthenticationService } from '../services/authentication.service';
import { AjouterEmployeDialogComponent } from '../ajouter-employe-dialog/ajouter-employe-dialog.component';
import { ModifierEmployeDialogComponent } from '../modifier-employe-dialog/modifier-employe-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employes',
  templateUrl: './employes.component.html',
  styleUrl: './employes.component.css'
})
export class EmployesComponent implements OnInit {

  employes: User[] = [];
  dataSource!: MatTableDataSource<User>;
  errorMessage: string | null = null;
  logedEmploye! : User;
  filterForm: FormGroup;
  errorMessageFilter: string | null = null;

  listCin!: string[];
  listNom!: string[];
  listPrenom!: string[];

  listGrades = Object.values(Grade);
  displayedColumnsEmployes = ["cin", "nom","prenom","email","grade","actions"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder,private authenticationService : AuthenticationService,private aulshService: AulshService, public dialog : MatDialog,private snackBar: MatSnackBar) {
    this.filterForm = this.fb.group({
      cin: [''],
      nom: [''],
      prenom: [''],
      grade: [''],
    });
  }

  ngOnInit(): void {

    const authenticatedUser = this.authenticationService.authenticatedUserDetails;
    if (authenticatedUser) {
      this.logedEmploye = authenticatedUser;
      const departementId = this.logedEmploye.departement?.id;
      if (departementId !== undefined) {
        this.loadEmployesByDepartement(departementId);
      }
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



  onSearch(): void {
    const filterValues = this.filterForm.value;
    this.errorMessageFilter = null;
    this.dataSource.data = [];


    const departementId = this.logedEmploye.departement?.id;
    if (departementId !== undefined) {

    
      this.aulshService.filterEmploye(departementId,filterValues).subscribe({
        next: data => {
          this.dataSource.data = data;
        },
        error: err => {
          this.errorMessageFilter = err.message;
        }
      });
    }
  }
  

  openDialogModifier(employe: any) {
    const dialogRef = this.dialog.open(ModifierEmployeDialogComponent, {
      data: employe
    });
  

    const departementId = this.logedEmploye.departement?.id;
    if (departementId !== undefined) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadEmployesByDepartement(departementId);
        }
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AjouterEmployeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const departementId = this.logedEmploye.departement?.id;
      if (departementId !== undefined) {
        this.loadEmployesByDepartement(departementId);
      }
      }
    });
  }


  loadEmployesByDepartement(id:number): void {
    this.aulshService.getAllEmployesByDepartement(id).subscribe({
      next: value => {
        this.employes = value;

        this.listCin = this.employes.map(emp => emp.cin);
        this.listNom = this.employes.map(emp => emp.nom);
        this.listPrenom = this.employes.map(emp => emp.prenom);

        this.dataSource = new MatTableDataSource<User>(this.employes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (obj: User, property: string) => {
          return this.getNestedProperty(obj, property);
        };
        this.dataSource.sort = this.sort;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  

  deleteEmploye(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.aulshService.deleteEmploye(id).subscribe({
          next: () => {
            
            this.snackBar.open('Employe deleted successfully', 'Close', {
              duration: 3000
            });

            const departementId = this.logedEmploye.departement?.id;
            if (departementId !== undefined) {
              this.loadEmployesByDepartement(departementId);
            }
          },
          error: err => {
            console.error('Error deleting employe', err);
            this.snackBar.open('Error deleting employe', 'Close', {
              duration: 3000
            });
          }
        });
      }
    });
  }

}