import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Developer } from 'src/app/models/developer.model';
import { User } from 'src/app/models/user.model';
import { Game } from 'src/app/models/game.model';
import { DevelopersService } from 'src/app/services/developers.service';
import { UsersService } from 'src/app/services/users.service';
import { GamesService } from 'src/app/services/games.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  games: Game[] = [];
  users: User[] = [];
  developers: Developer[] = [];

  public gameForm !: FormGroup;
  public userForm !: FormGroup;
  public developerForm !: FormGroup;

  public role!: string;

  showAdd !: boolean;
  showEdit !: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private developerService: DevelopersService,
    private userService: UsersService,
    private gameService: GamesService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.refreshGameData();
    this.refreshUserData();
    this.refreshDevData();

    this.userService.getRoleFromLocalStorage()
    .subscribe(value => {
      let roleFromToken = this.authService.getRole();
      this.role = value || roleFromToken;
    })
  }

  initForms(){
    this.gameForm = this.formBuilder.group({
      id: 0,
      name: [''],
      releaseDate: Date(),
      description: [''],
      price: 0,
      devTeam: 0
    })
    this.userForm = this.formBuilder.group({
      id: 0,
      username: [''],
      password: [''],
      role: [''],
      devTeam: -1
    })
    this.developerForm = this.formBuilder.group({
      id: 0,
      name: ['']
    })
  }

  refreshGameData(){
    this.gameService.getAllGames()
    .subscribe({
      next: (games) => {
        console.log(games);
        this.games = games
      },
      error: (response) => {
        console.log(response)
      }
    })
  }

  refreshUserData(){
    this.userService.getAllUsers()
    .subscribe({
      next: (users) => {
        console.log(users);
        this.users = users;
      },
      error: (response) => {
        console.log(response)
      }
    })
  }

  refreshDevData(){
    this.developerService.getAllDevelopers()
    .subscribe({
      next: (developers) => {
        console.log(developers);
        this.developers = developers;
      },
      error: (response) => {
        console.log(response)
      }
    });
  }

  addGame(){
    var formData: any = new FormData();
    formData.append('Name', this.gameForm.get('name')?.value);
    formData.append('ReleaseDate', this.gameForm.get('releaseDate')?.value);
    formData.append('Description', this.gameForm.get('description')?.value);
    formData.append('Price', this.gameForm.get('price')?.value);
    formData.append('DevTeamId', this.gameForm.get('devTeam')?.value);

    this.gameService.addGame(formData)
    .subscribe({
      next: (game) => {
        console.log(game);
        this.gameForm.reset();
        let ref = document.getElementById('gameCancel');
        ref?.click();
        this.refreshGameData();
      }
    })
  }

  addUser(){
    var formData: any = new FormData();
    formData.append('Username', this.userForm.get('username')?.value);
    formData.append('Password', this.userForm.get('password')?.value);
    formData.append('Role', this.userForm.get('role')?.value);
    formData.append('DevTeam', this.userForm.get('devTeam')?.value);

    this.userService.addUser(formData)
    .subscribe({
      next: (user) => {
        console.log(user);
        this.userForm.reset();
        let ref = document.getElementById('userCancel');
        ref?.click();
        this.refreshUserData();
      },
      error: (error) => {
        console.log(error.error.message)
      }
    })
  }

  addDeveloper(){
    var formData: any = new FormData();
    formData.append('Name', this.developerForm.get('name')?.value);

    this.developerService.addDeveloper(formData)
    .subscribe({
      next: (developer) => {
        console.log(developer);
        this.developerForm.reset();
        let ref = document.getElementById('devCancel');
        ref?.click();
        this.refreshDevData();
      }
    })
  }

  deleteGame(id: number){
    this.gameService.deleteGame(id)
    .subscribe({
      next: (game) => {
        console.log(game);
        this.refreshGameData();
      }
    })
  }

  deleteUser(id: number){
    this.userService.deleteUser(id)
    .subscribe({
      next: (user) => {
        console.log(user);
        this.refreshUserData();
      }
    })
  }

  deleteDeveloper(id: number){
    this.developerService.deleteDeveloper(id)
    .subscribe({
      next: (developer) => {
        console.log(developer);
        this.refreshDevData();
      }
    });
  }

  updateGame(){
    var formData: any = new FormData();
    formData.append('Id', this.gameForm.get('id')?.value);
    formData.append('Game_Name', this.gameForm.get('name')?.value);
    formData.append('Game_RelDate', this.gameForm.get('releaseDate')?.value);
    formData.append('Game_Description', this.gameForm.get('description')?.value);
    formData.append('Game_Price', this.gameForm.get('price')?.value);
    formData.append('DevTeam_Id', this.gameForm.get('devTeam')?.value);

    this.gameService.updateGame(formData)
    .subscribe({
      next: (game) => {
        console.log(game);
        let ref = document.getElementById('gameCancel');
        ref?.click();
        this.refreshGameData();
      }
    })
  }

  updateUser(){
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
        this.refreshUserData();
      }
    })
  }

  updateDeveloper(){
    var formData: any = new FormData();
    formData.append('Id', this.developerForm.get('id')?.value)
    formData.append('DevTeam_name', this.developerForm.get('name')?.value);

    this.developerService.updateDeveloper(formData)
    .subscribe({
      next: (developer) => {
        console.log(developer);
        let ref = document.getElementById('devCancel');
        ref?.click();
        this.refreshDevData();
      }
    })
  }

  onAddGame(){
    this.gameForm.reset();
    this.showAdd = true;
    this.showEdit = false;
  }

  onAddUser(){
    this.userForm.reset();
    this.showAdd = true;
    this.showEdit = false;
  }

  onAddDeveloper(){
    this.developerForm.reset();
    this.showAdd = true;
    this.showEdit = false;
  }

  onEditGame(game: Game){
    this.showAdd = false;
    this.showEdit = true;
    this.gameForm.controls['id'].setValue(game.id);
    this.gameForm.controls['name'].setValue(game.game_Name);
    this.gameForm.controls['releaseDate'].setValue(formatDate(game.game_RelDate, 'yyyy-MM-dd','en'));
    this.gameForm.controls['description'].setValue(game.game_Description);
    this.gameForm.controls['price'].setValue(game.game_Price);
    this.gameForm.controls['devTeam'].setValue(game.devTeam_Id);
  }

  onEditUser(user: User){
    this.showAdd = false;
    this.showEdit = true;
    this.userForm.controls['id'].setValue(user.id);
    this.userForm.controls['username'].setValue(user.user_Name);
    this.userForm.controls['password'].setValue(user.user_Password);
    this.userForm.controls['role'].setValue(user.role);
    this.userForm.controls['devTeam'].setValue(user.devTeam_Id);
  }

  onEditDeveloper(dev: Developer){
    this.showAdd = false;
    this.showEdit = true;
    this.developerForm.controls['id'].setValue(dev.id);
    this.developerForm.controls['name'].setValue(dev.devTeam_name);
  }
}