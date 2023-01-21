import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  addUser(addUserFormData: any): Observable<User> {
    return this.http.post<User>('https://localhost:7172/api/user/addUser', addUserFormData);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://localhost:7172/api/user/getUsers');
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>('https://localhost:7172/api/user/getUser/' + id);
  }

  deleteUser(id: number){
    return this.http.delete<User>('https://localhost:7172/api/user/deleteUser/' + id);
  }

  updateUser(editUserFormData: any): Observable<User>{
    return this.http.put<User>('https://localhost:7172/api/user/updateUser', editUserFormData);
  }
}
