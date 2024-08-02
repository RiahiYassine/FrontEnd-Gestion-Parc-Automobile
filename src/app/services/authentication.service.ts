import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../model/vehicule.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  private authenticatedUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<User>(`${environment.backendHost}/users/login`, { email, password })
      .pipe(
        map(user => {
          this.authenticatedUser = user;
          return true;
        }),
        catchError(() => {
          this.authenticatedUser = null;
          return of(false);
        })
      );
  }

  get authenticated(): boolean {
    return this.authenticatedUser !== null;
  }

  get userRole(): string | null {
    return this.authenticatedUser ? this.authenticatedUser.role : null;
  }

  get authenticatedUserDetails(): User | null {
    return this.authenticatedUser;
  }

  logout(): void {
    this.authenticatedUser = null;
    this.router.navigateByUrl("/login");
  }
}
