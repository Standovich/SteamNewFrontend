import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  public id!: number;
  public developers: Developer[] = [];
  public userForm !: FormGroup;
  public passwdForm !: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private developerService: DevelopersService,
    private authService: AuthenticationService
  ){}

  ngOnInit(): void {
    this.initForms();
    this.getData();
  }

  initForms(){
    this.userForm = this.formBuilder.group({
      id: 0,
      username: [''],
      password: [''],
      confirm: [''],
      role: [''],
      devTeam: -1
    })

    this.passwdForm = this.formBuilder.group({
      passwd: ['']
    })
  }

  getData(){
    this.userService.getUserByName(this.authService.getUsername())
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
    this.userForm.controls['password'].setValue("");
    this.userForm.controls['confirm'].setValue("");
    this.userForm.controls['role'].setValue(this.user.role);
    this.userForm.controls['devTeam'].setValue(this.user.devTeam_Id);
    this.roleChange();
  }

  resetConfirmForm(){
    this.passwdForm.reset();
  }

  roleChange(){
    if(this.userForm.get('role')?.value !== 'Developer')
    this.userForm.controls['devTeam'].disable();
    else this.userForm.controls['devTeam'].enable();
  }

  confirmChanges(){
    var formData: any = new FormData();
    formData.append('Username', this.authService.getUsername());
    formData.append('Password', this.passwdForm.get('passwd')?.value);

    this.authService.logIn(formData)
    .subscribe({
      next: (response) => {
        this.userForm.get('password')?.
        setValue(this.passwdForm.get('passwd')?.value);
        this.pushChanges();
        alert("Password successfuly changed!");
        let ref = document.getElementById('userCancel');
        ref?.click();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  pushChanges(){
    var formData: any = new FormData();
    formData.append('Id', this.userForm.get('id')?.value)
    formData.append('User_Name', this.userForm.get('username')?.value)
    formData.append('User_Password', this.userForm.get('password')?.value)
    formData.append('Role', this.userForm.get('role')?.value)
    formData.append('DevTeam_Id', this.userForm.get('devTeam')?.value);

    this.userService.updateUser(formData)
    .subscribe({
      next: (user) => {
        console.log(user);
        let ref = document.getElementById('userCancel');
        ref?.click();
      }
    })
  }
}
