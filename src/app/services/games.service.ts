import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient) { }

  addGame(addGameFormData: any): Observable<Game> {
    return this.http.post<Game>('https://localhost:7172/api/game/addGame', addGameFormData);
  }

  getAllGames(): Observable<Game[]> {
    return this.http.get<Game[]>('https://localhost:7172/api/game/getGames');
  }

  getGamesByDev(id: number):Observable<Game[]> {
    return this.http.get<Game[]>('https://localhost:7172/api/game/getGamesByDev/' + id);
  }

  getGame(id: number): Observable<Game> {
    return this.http.get<Game>('https://localhost:7172/api/game/getGame/' + id);
  }

  getOwnedGames(username: string): Observable<Game[]>{
    return this.http.get<Game[]>('https://localhost:7172/api/game/getOwned/' + username);
  }

  deleteGame(id: number){
    return this.http.delete<Game>('https://localhost:7172/api/game/deleteGame/' + id);
  }

  updateGame(editGameFormData: any): Observable<Game>{
    return this.http.put<Game>('https://localhost:7172/api/game/updateGame', editGameFormData);
  }
}
