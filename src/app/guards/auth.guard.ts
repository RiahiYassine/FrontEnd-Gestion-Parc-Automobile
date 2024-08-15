import { Injectable } from '@angular/core';
import { GuardResult, MaybeAsync, Router} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard{
  constructor(private authService : AuthenticationService, private router : Router){

  }

  canActivate(): boolean {
    if (this.authService.authenticated) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}