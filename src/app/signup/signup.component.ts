import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  public signupForm !: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username: [''],
      passwd: ['']
    })
  }

  submitForm() {
    var formData: any = new FormData();
    formData.append('Username', this.signupForm.get('username')?.value);
    formData.append('Passwd', this.signupForm.get('passwd')?.value);

    this.http.post('api/user/createUser', formData)
      .subscribe(res => {
        alert("You have successfully signed up!")
        this.signupForm.reset();
        this.router.navigate(['login'])
      }, error => {
        alert("Something went wrong!")
      });
  }
}
