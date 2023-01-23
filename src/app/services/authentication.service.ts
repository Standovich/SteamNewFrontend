import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userPayload: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UsersService
  ) {
    this.userPayload = this.decodedToken();
  }

  logIn(loginFormData: any): Observable<User> {
    return this.http.post<User>('https://localhost:7172/api/user/login', loginFormData);
  }

  verify(verifyFormData: any): Observable<User> {
    return this.http.post<User>('https://localhost:7172/api/user/verify', verifyFormData);
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

  updateLocalStorage(){
    let tokenPayload = this.decodedToken();
    this.userService.setUsernameToLocalStorage(tokenPayload.name);
    this.userService.setRoleToLocalStorage(tokenPayload.role);
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
