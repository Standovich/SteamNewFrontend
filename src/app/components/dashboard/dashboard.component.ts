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
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  public games: Game[] = [];
  public users: User[] = [];
  public developers: Developer[] = [];
  public posts: Post[] = [];
  public devTeam!: Developer;

  public gameForm !: FormGroup;
  public userForm !: FormGroup;
  public developerForm !: FormGroup;
  public postForm !: FormGroup;

  public role!: string;
  private devTeamId!: number;
  private selectedGame!: number;

  showAdd !: boolean;
  showEdit !: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private developerService: DevelopersService,
    private userService: UsersService,
    private gameService: GamesService,
    private postService: PostsService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.initDevValues();
    this.initForms();
    this.refreshGameData();
    if(this.role !== 'Developer'){
      this.refreshUserData();
      this.refreshDevData();
    }
  }

  initDevValues(){
    this.userService.getRoleFromLocalStorage()
    .subscribe(value => {
      let roleFromToken = this.authService.getRole();
      this.role = value || roleFromToken;
    })

    this.userService.getDevTeamFromLocalStorage()
    .subscribe(value => {
      let devFromToken = this.authService.getDevTeam();
      this.devTeamId = value || devFromToken;
    })

    this.developerService.getDeveloper(this.devTeamId)
    .subscribe({
      next: (dev) => {
        this.devTeam = dev;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  initForms(){
    this.gameForm = this.formBuilder.group({
      id: 0,
      name: [''],
      releaseDate: Date(),
      description: [''],
      price: 0,
      devTeam: this.devTeam
    })
    this.postForm = this.formBuilder.group({
      id: 0,
      title: [''],
      content: [''],
      gameId: -1
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
    if(this.role === 'Developer'){
      this.gameService.getGamesByDev(this.devTeamId)
      .subscribe({
        next: (games) => {
          console.log(games);
          this.games = games;
          this.selectedGame = games[0].id;
          this.refreshPostData(this.selectedGame);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
    else{
      this.gameService.getAllGames()
      .subscribe({
        next: (games) => {
          console.log(games);
          this.games = games;
          this.selectedGame = games[0].id;
          this.refreshPostData(this.selectedGame);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  refreshPostData(id: number){
    this.postService.getPostsByGame(id)
    .subscribe({
      next: (posts) => {
        console.log(posts);
        this.posts = posts;
      },
      error: (err) => {
        console.log(err)
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
      error: (err) => {
        console.log(err)
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
      error: (err) => {
        console.log(err)
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
      next: (response) => {
        alert(response.message);
        this.gameForm.reset();
        let ref = document.getElementById('gameCancel');
        ref?.click();
        this.refreshGameData();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  addPost(){
    var formData: any = new FormData();
    formData.append('Title', this.postForm.get('title')?.value);
    formData.append('Content', this.postForm.get('content')?.value);
    formData.append('GameId', this.selectedGame);

    console.log(this.postForm.get('title')?.value);
    console.log(this.postForm.get('content')?.value);
    console.log(this.selectedGame);

    this.postService.addPost(formData)
    .subscribe({
      next: (response) => {
        alert(response.message);
        this.postForm.reset();
        let ref = document.getElementById('postCancel');
        ref?.click();
        this.refreshPostData(this.selectedGame);
      },
      error: (err) => {
        console.log(err);
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
      next: (response) => {
        alert(response.message)
        this.userForm.reset();
        let ref = document.getElementById('userCancel');
        ref?.click();
        this.refreshUserData();
      },
      error: (err) => {
        alert(err?.error.message);
        console.log(err?.error.message);
      }
    })
  }

  addDeveloper(){
    var formData: any = new FormData();
    formData.append('Name', this.developerForm.get('name')?.value);

    this.developerService.addDeveloper(formData)
    .subscribe({
      next: (response) => {
        alert(response.message);
        this.developerForm.reset();
        let ref = document.getElementById('devCancel');
        ref?.click();
        this.refreshDevData();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  deleteGame(id: number){
    this.gameService.deleteGame(id)
    .subscribe({
      next: (response) => {
        alert(response.message);
        this.refreshGameData();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  deletePost(id: number){
    this.postService.deletePost(id)
    .subscribe({
      next: (response) => {
        alert(response.message);
        this.refreshPostData(this.selectedGame);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  deleteUser(id: number){
    this.userService.deleteUser(id)
    .subscribe({
      next: (response) => {
        alert(response.message);
        this.refreshUserData();
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  deleteDeveloper(id: number){
    this.developerService.deleteDeveloper(id)
    .subscribe({
      next: (response) => {
        alert(response.message);
        this.refreshDevData();
      },
      error: (err) => {
        console.log(err)
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
      next: (response) => {
        alert(response.message);
        let ref = document.getElementById('gameCancel');
        ref?.click();
        this.refreshGameData();
      }
    })
  }

  updatePost(){
    var formData: any = new FormData();
    formData.append('Id', this.postForm.get('id')?.value);
    formData.append('Post_Title', this.postForm.get('title')?.value);
    formData.append('Post_Content', this.postForm.get('content')?.value);
    formData.append('Game_Id', this.selectedGame);

    this.postService.updatePost(formData)
    .subscribe({
      next: (response) => {
        alert(response.message)
        let ref = document.getElementById('postCancel');
        ref?.click();
        this.refreshPostData(this.selectedGame);
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
      next: (response) => {
        alert(response.message);
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
      next: (response) => {
        alert(response.message)
        let ref = document.getElementById('devCancel');
        ref?.click();
        this.refreshDevData();
      }
    })
  }

  onAddGame(){
    this.gameForm.reset();
    if(this.role === "Developer"){
      this.gameForm.controls['devTeam'].setValue(this.devTeam.id);
    }
    this.showAdd = true;
    this.showEdit = false;
  }

  onAddPost(){
    this.postForm.reset();
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

  onEditPost(post: Post){
    this.showAdd = false;
    this.showEdit = true;
    this.postForm.controls['id'].setValue(post.id);
    this.postForm.controls['title'].setValue(post.post_Title);
    this.postForm.controls['content'].setValue(post.post_Content);
    this.postForm.controls['gameId'].setValue(post.game_Id);
  }

  onEditUser(user: User){
    this.showAdd = false;
    this.showEdit = true;
    this.userForm.controls['id'].setValue(user.id);
    this.userForm.controls['username'].setValue(user.user_Name);
    this.userForm.controls['role'].setValue(user.role);
    this.userForm.controls['devTeam'].setValue(user.devTeam_Id);
    this.roleChange();
  }

  onEditDeveloper(dev: Developer){
    this.showAdd = false;
    this.showEdit = true;
    this.developerForm.controls['id'].setValue(dev.id);
    this.developerForm.controls['name'].setValue(dev.devTeam_name);
  }

  roleChange(){
    if(this.userForm.get('role')?.value !== 'Developer'){
      this.userForm.controls['devTeam'].setValue(-1);
      this.userForm.controls['devTeam'].disable();
    }
    else this.userForm.controls['devTeam'].enable();
  }

  gameSelectorChange(id: any){
    this.selectedGame = id;
    this.refreshPostData(this.selectedGame);
  }
}