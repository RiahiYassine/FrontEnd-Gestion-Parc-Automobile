import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { VehiculesComponent } from './vehicules/vehicules.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AssurancesComponent } from './operations/assurances/assurances.component';
import { ReparationsComponent } from './operations/reparations/reparations.component';
import { MaintenancesComponent } from './operations/maintenances/maintenances.component';
import { VISITETECHNIQUESComponent } from './operations/visitetechniques/visitetechniques.component';
import { SideBarChefComponent } from './side-bar-chef/side-bar-chef.component';
import { EmployesComponent } from './employes/employes.component';
import { MissionDepartementComponent } from './mission-departement/mission-departement.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { DepartementComponent } from './departement/departement.component';
import { MissionComponent } from './mission/mission.component';
import { CarburantsComponent } from './carburants/carburants.component';
import { NotificationListComponent } from './notification-list/notification-list.component';

const routes: Routes = [
  {path:"",component:SidebarAdminComponent},
  {path:"login",component:SidebarAdminComponent},
  {
    path:"admin", 
    component:SidebarAdminComponent, 
    //canActivate: [AuthGuard,AuthorizationGuard],
    //data: { roles: ['CHEF_PARC'] },
    children:[
      {path:"accueil",component:AccueilComponent},
      {path:"vehicules" , component:VehiculesComponent},
      {path:"operations/assurances",component:AssurancesComponent},
      {path:"operations/reparations",component:ReparationsComponent},
      {path:"operations/maintenances",component:MaintenancesComponent},
      {path:"operations/visiteTechnique",component:VISITETECHNIQUESComponent},
      {path:"operations/carburants",component:CarburantsComponent},
      {path:"missions",component:MissionComponent},
      {path:"departements",component:DepartementComponent},
      {path:"alertes",component:NotificationListComponent}
    ]
  },

 {
    path:"chef",
   // component:SideBarChefComponent, 
   // canActivate: [AuthGuard],
    data: { roles: ['CHEF_DEPARTMENT'] },
    children:[
      {path:"employes",component:EmployesComponent},
      //{path:"employes",component:EmployesComponent},
      {path:"missions",component:MissionDepartementComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
