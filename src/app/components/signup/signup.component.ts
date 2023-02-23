import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  public signupForm !: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
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
    formData.append('Password', this.signupForm.get('passwd')?.value);
    formData.append('Role', "Admin");
    formData.append('DevTeam', -1);

    this.userService.addUser(formData)
    .subscribe({
      next: (user) => {
        alert("You have successfully signed up!");
        this.signupForm.reset();
        this.router.navigate(['login']);
      },
      error: (response) => {
        console.log(response);
      }
    })
  }
}
