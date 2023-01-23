import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-storefront',
  templateUrl: './storefront.component.html',
  styleUrls: ['./storefront.component.css']
})
export class StorefrontComponent implements OnInit {
  public username: string = "";

  constructor(private authService: AuthenticationService, private userService: UsersService){}

  ngOnInit() {
    this.userService.getUsernameFromStore()
    .subscribe(value => {
      let usernameFromToken = this.authService.getUsername();
      this.username = value || usernameFromToken;
    })
  }

  logOut() {
    this.authService.logOut()
  }
}
