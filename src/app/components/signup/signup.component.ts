import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Developer } from 'src/app/models/developer.model';
import { DevelopersService } from 'src/app/services/developers.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  public signupForm !: FormGroup;
  public developers: Developer[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private developerService: DevelopersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDevData();
  }

  initForm(){
    this.signupForm = this.formBuilder.group({
      username: [''],
      passwd: [''],
      role: [''],
      devTeam: -1
    })
  }

  loadDevData(){
    this.developerService.getAllDevelopers()
    .subscribe({
      next: (developers) => {
        console.log(developers);
        this.developers = developers;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  submitForm() {
    var formData: any = new FormData();
    formData.append('Username', this.signupForm.get('username')?.value);
    formData.append('Password', this.signupForm.get('passwd')?.value);
    formData.append('Role', this.signupForm.get('role')?.value);
    formData.append('DevTeam', this.signupForm.get('devTeam')?.value);

    this.userService.addUser(formData)
    .subscribe({
      next: (response) => {
        alert(response.message);
        this.signupForm.reset();
        this.router.navigate(['login']);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  roleChange(){
    if(this.signupForm.get('role')?.value !== 'Developer'){
      this.signupForm.controls['devTeam'].setValue(-1);
      this.signupForm.controls['devTeam'].disable();
    }
    else this.signupForm.controls['devTeam'].enable();
  }
}
