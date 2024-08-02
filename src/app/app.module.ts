import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { VehiculesComponent } from './vehicules/vehicules.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AddMarqueDialogComponent } from './add-marque-dialog/add-marque-dialog.component';
import { AddModeleDialogComponent } from './add-modele-dialog/add-modele-dialog.component';
import { ModifierVehiculeDialogComponent } from './modifier-vehicule-dialog/modifier-vehicule-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AjouterVehiculeDialogComponent } from './ajouter-vehicule-dialog/ajouter-vehicule-dialog.component';
import { AssurancesComponent } from './operations/assurances/assurances.component';
import { ReparationsComponent } from './operations/reparations/reparations.component';
import { MaintenancesComponent } from './operations/maintenances/maintenances.component';
import { RescheduleDialogComponent } from './reschedule-dialog/reschedule-dialog.component';
import { ModifierAssuranceDialogComponent } from './operations/modifier-assurance-dialog/modifier-assurance-dialog.component';
import { AjouterAssuranceDialogComponent } from './operations/ajouter-assurance-dialog/ajouter-assurance-dialog.component';
import { VISITETECHNIQUESComponent } from './operations/visitetechniques/visitetechniques.component';
import { ModifierVisiteTechniqueDialogComponent } from './operations/modifier-visite-technique-dialog/modifier-visite-technique-dialog.component';
import { AjouterVisiteTechniqueDialogComponent } from './operations/ajouter-visite-technique-dialog/ajouter-visite-technique-dialog.component';
import { AjouterReparationDialogComponent } from './operations/ajouter-reparation-dialog/ajouter-reparation-dialog.component';
import { ModifierReparationDialogComponent } from './operations/modifier-reparation-dialog/modifier-reparation-dialog.component';
import { AjouterMaintenanceDialogComponent } from './operations/ajouter-maintenance-dialog/ajouter-maintenance-dialog.component';
import { ModifierMaintenanceDialogComponent } from './operations/modifier-maintenance-dialog/modifier-maintenance-dialog.component';
import { SideBarChefComponent } from './side-bar-chef/side-bar-chef.component';
import { EmployesComponent } from './employes/employes.component';
import { MissionDepartementComponent } from './mission-departement/mission-departement.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { DepartementComponent } from './departement/departement.component';
import { AjouterDepartementDialogComponent } from './ajouter-departement-dialog/ajouter-departement-dialog.component';
import { ModifierDepartementDialogComponent } from './modifier-departement-dialog/modifier-departement-dialog.component';
import { MissionComponent } from './mission/mission.component';
import { TraiterDialogComponent } from './traiter-dialog/traiter-dialog.component';
import { BaseChartDirective } from 'ng2-charts';
import { AjouterMissionDialogComponent } from './ajouter-mission-dialog/ajouter-mission-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { ModifierEmployeDialogComponent } from './modifier-employe-dialog/modifier-employe-dialog.component';
import { AjouterEmployeDialogComponent } from './ajouter-employe-dialog/ajouter-employe-dialog.component';
import { ModifierMissionDialogComponent } from './modifier-mission-dialog/modifier-mission-dialog.component';
import { ConsulterMissionDialogComponent } from './consulter-mission-dialog/consulter-mission-dialog.component';
import { CarburantsComponent } from './carburants/carburants.component';
import { AjouterCarburantDialogComponent } from './ajouter-carburant-dialog/ajouter-carburant-dialog.component';
import { ModifierCarburantDialogComponent } from './modifier-carburant-dialog/modifier-carburant-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarAdminComponent,
    VehiculesComponent,
    AccueilComponent,
    AjouterVehiculeDialogComponent,
    AddMarqueDialogComponent,
    AddModeleDialogComponent,
    ModifierVehiculeDialogComponent,
    ConfirmationDialogComponent,
    AssurancesComponent,
    ReparationsComponent,
    MaintenancesComponent,
    RescheduleDialogComponent,
    ModifierAssuranceDialogComponent,
    AjouterAssuranceDialogComponent,
    VISITETECHNIQUESComponent,
    ModifierVisiteTechniqueDialogComponent,
    AjouterVisiteTechniqueDialogComponent,
    AjouterReparationDialogComponent,
    ModifierReparationDialogComponent,
    AjouterMaintenanceDialogComponent,
    ModifierMaintenanceDialogComponent,
    SideBarChefComponent,
    EmployesComponent,
    MissionDepartementComponent,
    LoginComponent,
    DepartementComponent,
    AjouterDepartementDialogComponent,
    ModifierDepartementDialogComponent,
    MissionComponent,
    TraiterDialogComponent,
    AjouterMissionDialogComponent,
    ModifierEmployeDialogComponent,
    AjouterEmployeDialogComponent,
    ModifierMissionDialogComponent,
    ConsulterMissionDialogComponent,
    CarburantsComponent,
    AjouterCarburantDialogComponent,
    ModifierCarburantDialogComponent,
    
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule,
    BaseChartDirective,
    MatChipsModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    AuthGuard,
    AuthorizationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
