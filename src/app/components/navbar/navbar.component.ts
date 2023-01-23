import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  public username: string = "";
  public role!: string;

  constructor(private authService: AuthenticationService, private userService: UsersService){}

  ngOnInit() {
    this.userService.getUsernameFromLocalStorage()
    .subscribe(value => {
      let usernameFromToken = this.authService.getUsername();
      this.username = value || usernameFromToken;
    });

    this.userService.getRoleFromLocalStorage()
    .subscribe(value => {
      let roleFromToken = this.authService.getRole();
      this.role = value || roleFromToken;
    });
  }

  logOut() {
    this.authService.logOut();
  }

  isLogged(): boolean{
    return this.authService.isLogged();
  }
}
