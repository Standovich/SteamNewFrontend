import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm !: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [''],
      passwd: ['']
    })
  }

  login() {
    var formData: any = new FormData();
    formData.append('Username', this.loginForm.get('username')?.value);
    formData.append('Passwd', this.loginForm.get('passwd')?.value);

    this.http.get('api/user/login', formData)
      .subscribe(res => {
        alert(res)
        this.loginForm.reset();
        this.router.navigate(['storefront'])
      }, error => {
        alert(error.message)
      });
  }
}
