import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  private role !: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    if(this.authService.isLogged())
    this.initialNavigation();

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
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
        console.log(response.token);
        this.authService.storeToken(response.token);
        this.authService.updateLocalStorage();
        this.initialNavigation();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  initialNavigation(){
    this.userService.getRoleFromLocalStorage()
    .subscribe(value => {
      let roleFromToken = this.authService.getRole();
      this.role = value || roleFromToken;
    })

    if(this.role === 'Customer') {
      this.router.navigate(['storefront']);
    }
    else{
      this.router.navigate(['dashboard']);
    }
  }
}
