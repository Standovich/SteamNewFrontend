import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Developer } from '../models/developer.model';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService {

  constructor(private http: HttpClient) { }

  addDeveloper(addDevFormData: any) {
    return this.http.post<any>('https://localhost:7172/api/developer/addDeveloper', addDevFormData);
  }

  getAllDevelopers(): Observable<Developer[]> {
    return this.http.get<Developer[]>('https://localhost:7172/api/developer/getDevelopers');
  }

  getDeveloper(id: number): Observable<Developer> {
    return this.http.get<Developer>('https://localhost:7172/api/developer/getDeveloper/' + id);
  }

  deleteDeveloper(id: number){
    return this.http.delete<any>('https://localhost:7172/api/developer/deleteDeveloper/' + id);
  }

  updateDeveloper(editDevFormData: any){
    return this.http.put<any>('https://localhost:7172/api/developer/updateDeveloper', editDevFormData);
  }
}
