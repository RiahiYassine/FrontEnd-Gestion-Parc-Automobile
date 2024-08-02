import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Departement } from '../model/vehicule.model';

@Component({
  selector: 'app-side-bar-chef',
  templateUrl: './side-bar-chef.component.html',
  styleUrl: './side-bar-chef.component.css'
})
export class SideBarChefComponent implements OnInit {


  constructor(private authenticationService : AuthenticationService){}

  email: string | null = null;
  role: string | null = null;
  departement: Departement | null = null;


  ngOnInit(): void {
    const authenticatedUser = this.authenticationService.authenticatedUserDetails;
    if (authenticatedUser) {
      this.email = `${authenticatedUser.email}`;
      this.role = `${authenticatedUser.role}`;
      this.departement = authenticatedUser.departement || null;
    }
  }


  logout(): void {
    this.authenticationService.logout();
  }
}