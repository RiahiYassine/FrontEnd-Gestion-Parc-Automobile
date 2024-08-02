import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { RoleUser } from '../model/vehicule.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginFormGroup!: FormGroup;
  loginFailed: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    const email = this.loginFormGroup.value.email;
    const password = this.loginFormGroup.value.password;

    this.authService.login(email, password).subscribe(auth => {
      if (auth) {
        const role = this.authService.userRole;
        if (role === RoleUser.CHEF_PARC) {
          this.router.navigateByUrl('/admin');
        } else if (role === RoleUser.EMPLOYE) {
          this.router.navigateByUrl('/employee');
        } else if (role === RoleUser.CHEF_DEPARTMENT) {
          this.router.navigateByUrl('/chef');
        } else {
          console.error('No valid role found for user.');
        }
      } else {
        this.loginFailed = true;
      }
    });
  }

}
