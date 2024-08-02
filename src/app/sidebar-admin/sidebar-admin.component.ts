import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Departement, RoleUser } from '../model/vehicule.model';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent implements OnInit {


  constructor(private authenticationService : AuthenticationService){}

  nom: string | null = null;
  role: string | null = null;
  departement: Departement | null = null;

  ngOnInit(): void {
    const authenticatedUser = this.authenticationService.authenticatedUserDetails;
    if (authenticatedUser) {
      this.nom = `${authenticatedUser.nom}`;
      this.role = `${authenticatedUser.role}`;
      this.departement = authenticatedUser.departement || null;
    }
  }

  logout(): void {
    this.authenticationService.logout();
  }

}
