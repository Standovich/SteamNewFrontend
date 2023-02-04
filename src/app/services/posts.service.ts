import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) { }

  addPost(addPostFormData: any){
    return this.http.post<any>('https://localhost:7172/api/post/addPost', addPostFormData);
  }

  getAllPosts(): Observable<Post[]>{
    return this.http.get<Post[]>('https://localhost:7172/api/post/getPosts');
  }

  getPostsByGame(id: number): Observable<Post[]>{
    return this.http.get<Post[]>('https://localhost:7172/api/post/getPostsByGame/' + id);
  }

  getPost(id: number): Observable<Post>{
    return this.http.get<Post>('https://localhost:7172/api/post/getPost/' + id);
  }

  deletePost(id: number){
    return this.http.delete<any>('https://localhost:7172/api/post/deletePost/' + id);
  }

  updatePost(editPostFormData: any){
    return this.http.put<any>('https://localhost:7172/api/post/updatePost', editPostFormData);
  }
}
