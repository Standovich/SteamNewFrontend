import { Component, OnInit } from '@angular/core';
import { Developer } from 'src/app/models/developer.model';
import { Game } from 'src/app/models/game.model';
import { Post } from 'src/app/models/post.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DevelopersService } from 'src/app/services/developers.service';
import { GamesService } from 'src/app/services/games.service';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit{
  public games: Game[] = [];
  public developers: Developer[] = [];
  public posts: Post[] = [];
  public display: boolean = false;
  public gameDisplay!: Game;
  private username!: string;

  constructor(
    private gameService: GamesService,
    private authService: AuthenticationService,
    private userService: UsersService,
    private developerService: DevelopersService,
    private postService: PostsService
  ){}
  ngOnInit(): void {
    this.loadUsername();
    this.loadGames();
    this.loadDevs();
  }

  loadUsername(){
    this.userService.getUsernameFromLocalStorage()
    .subscribe(value => {
      let usernameFromToken = this.authService.getUsername();
      this.username = value || usernameFromToken;
    });
  }

  loadGames(){
    this.gameService.getOwnedGames(this.username)
    .subscribe({
      next: (games) => {
        this.games = games;
      },
      error: (err) => {
        console.log(err._body);
      }
    })
  }

  loadDevs(){
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

  loadPosts(id: number){
    this.postService.getPostsByGame(id)
    .subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getDeveloper(id: number){
    return this.developers.find(d => d.id === id)?.devTeam_name;
  }

  changeGame(game: Game){
    this.display = true;
    this.loadPosts(game.id);
    this.gameDisplay = game;
  }
}
