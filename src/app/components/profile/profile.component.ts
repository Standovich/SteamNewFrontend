import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Developer } from 'src/app/models/developer.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DevelopersService } from 'src/app/services/developers.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  public user!: User;
  public developers: Developer[] = [];
  public userForm !: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private developerService: DevelopersService,
    private authService: AuthenticationService
  ){}

  ngOnInit(): void {
    this.getData();
    this.initForms();
  }

  initForms(){
    this.userForm = this.formBuilder.group({
      id: 0,
      username: [''],
      oldPassword: ['', Validators.required],
      newPassword: [''],
      role: [''],
      devTeam: -1
    })
  }

  getData(){
    let username = "";
    this.userService.getUsernameFromLocalStorage()
    .subscribe(value => {
      let roleFromToken = this.authService.getUsername();
      username = value || roleFromToken;
    })

    this.userService.getUserByName(username)
    .subscribe({
      next: (user) => {
        this.user = user;
        this.setForm();
        console.log(user);
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.developerService.getAllDevelopers()
    .subscribe({
      next: (developers) => {
        this.developers = developers;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  setForm(){
    this.userForm.reset();
    this.userForm.controls['id'].setValue(this.user.id);
    this.userForm.controls['username'].setValue(this.user.user_Name);
    this.userForm.controls['oldPassword'].setValue("");
    this.userForm.controls['newPassword'].setValue("");
    this.userForm.controls['role'].setValue(this.user.role);
    this.userForm.controls['devTeam'].setValue(this.user.devTeam_Id);
    this.roleChange();
  }

  roleChange(){
    if(this.userForm.get('role')?.value !== 'Developer')
    this.userForm.controls['devTeam'].disable();
    else this.userForm.controls['devTeam'].enable();
  }

  submitChanges(){
    var formData: any = new FormData();
    formData.append('Id', this.userForm.get('id')?.value);
    formData.append('User_Name', this.userForm.get('username')?.value);
    formData.append('User_OldPassword', this.userForm.get('oldPassword')?.value);
    let newPassword = this.userForm.get('newPassword')?.value;
    console.log(newPassword);
    formData.append('User_NewPassword', newPassword);
    formData.append('Role', this.userForm.get('role')?.value);
    formData.append('DevTeam_Id', this.userForm.get('devTeam')?.value);

    this.userService.updateUserAuth(formData)
    .subscribe({
      next: (response) => {
        alert(response.message);
        console.log(response.token);
        this.authService.storeToken(response.token);
        this.authService.updateLocalStorage();
        this.userForm.reset();
        this.getData();
      },
      error: (err) => {
        console.log(err);
        this.setForm();
      }
    })
  }
}
