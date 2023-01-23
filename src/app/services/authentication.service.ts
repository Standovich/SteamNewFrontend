import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userPayload: any;

  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  logIn(loginFormData: any): Observable<User> {
    return this.http.post<User>('https://localhost:7172/api/user/login', loginFormData);
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token')
  }

  decodedToken(){
    const JwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return JwtHelper.decodeToken(token);
  }

  getUsername(){
    if(this.userPayload) 
    return this.userPayload.name;
  }

  getRole(){
    if(this.userPayload)
    return this.userPayload.role;
  }

  getDevTeam(){
    if(this.userPayload)
    return this.userPayload.userdata;
  }
}
