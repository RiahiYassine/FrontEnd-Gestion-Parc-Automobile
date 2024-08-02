import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthorizationGuard{


  constructor(private authService : AuthenticationService, private router : Router){

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    
    const authorizedRoles = route.data['roles'] as string[];
    const userRoles = this.authService.userRole ? [this.authService.userRole] : [];

    if (userRoles && authorizedRoles.some(role => userRoles.includes(role))) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }
}