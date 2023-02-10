import { Component, OnInit } from '@angular/core';
import { Developer } from 'src/app/models/developer.model';
import { Game } from 'src/app/models/game.model';
import { Post } from 'src/app/models/post.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DevelopersService } from 'src/app/services/developers.service';
import { GamesService } from 'src/app/services/games.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-storefront',
  templateUrl: './storefront.component.html',
  styleUrls: ['./storefront.component.css']
})
export class StorefrontComponent implements OnInit {
  public games: Game[] = [];
  public developers: Developer[] = [];
  public posts: Post[] = [];
  public gameDisplay!: Game;
  private userId!: number;
  public display: boolean = false;

  constructor(
    private gameService: GamesService,
    private developerService: DevelopersService,
    private postService: PostsService,
    private paymentService: PaymentsService,
    private userService: UsersService,
    private authService: AuthenticationService
  ){}

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.gameService.getAllGames()
    .subscribe({
      next: (games) => {
        this.games = games;
        console.log(games);
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

    let name!: string;
    this.userService.getUsernameFromLocalStorage()
    .subscribe(value => {
      let roleFromToken = this.authService.getUsername();
      name = value || roleFromToken;
    })

    this.userService.getUserByName(name)
    .subscribe({
      next: (user) => {
        this.userId = user.id;
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

  buyGame(gameId: number){
    var formData: any = new FormData();
    formData.append('UserId', this.userId);
    formData.append('GameId', gameId);
    this.paymentService.purchase(formData)
    .subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
