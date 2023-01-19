import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Developer } from '../models/developer.model';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService {

  constructor(private http: HttpClient) { }

  addDeveloper(addDevFormData: any): Observable<Developer> {
    return this.http.post<Developer>('https://localhost:7172/api/developer/addDeveloper', addDevFormData);
  }

  getAllDevelopers(): Observable<Developer[]> {
    return this.http.get<Developer[]>('https://localhost:7172/api/developer/getDevelopers');
  }

  deleteDeveloper(id: number){
    return this.http.delete<Developer>('https://localhost:7172/api/developer/deleteDeveloper/'+id);
  }
}
