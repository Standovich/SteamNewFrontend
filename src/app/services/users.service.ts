import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private username$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private devTeam$ = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) { }

  public getRoleFromLocalStorage(){
    return this.role$.asObservable();
  }

  public setRoleToLocalStorage(role: string){
    this.role$.next(role);
  }

  public getUsernameFromLocalStorage(){
    return this.username$.asObservable();
  }

  public setUsernameToLocalStorage(username: string){
    this.username$.next(username);
  }

  public getDevTeamFromLocalStorage(){
    return this.devTeam$.asObservable();
  }

  public setDevTeamToLocalStorage(devteam: string){
    this.devTeam$.next(devteam);
  }

  addUser(addUserFormData: any) {
    return this.http.post<any>('https://localhost:7172/api/user/addUser', addUserFormData);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://localhost:7172/api/user/getUsers');
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>('https://localhost:7172/api/user/getUserById/' + id);
  }

  getUserByName(username: string): Observable<User> {
    return this.http.get<User>('https://localhost:7172/api/user/getUserByName/' + username);
  }

  deleteUser(id: number){
    return this.http.delete<User>('https://localhost:7172/api/user/deleteUser/' + id);
  }

  updateUser(editUserFormData: any){
    return this.http.put<any>('https://localhost:7172/api/user/updateUser', editUserFormData);
  }
}
