import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm !: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    if(this.authService.isLogged())
    this.router.navigate(['storefront']);

    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    })
  }

  login() {
    var formData: any = new FormData();
    formData.append('Username', this.loginForm.get('username')?.value);
    formData.append('Password', this.loginForm.get('password')?.value);

    this.authService.logIn(formData)
    .subscribe({
      next: (response) => {
        this.loginForm.reset();
        console.log(response.token)
        this.authService.storeToken(response.token)
        this.authService.updateLocalStorage();
        this.router.navigate(['storefront']);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
