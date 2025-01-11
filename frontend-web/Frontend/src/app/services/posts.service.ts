import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post} from '../shared/models/post/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly apiUrl = "http://localhost:8095/post/api/posts"
  constructor(private readonly http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getConceptPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + "/concept");
  }

  getPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + "/published");
  }

  addPost(post: Post, userRole: string): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post, {headers : {'User-Role': userRole}});
  }

  getPostByTitle(title: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/findByTitle?title=${title}`);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/findById/${id}`);
  }

  getAllPostsByTitle(title: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/findAllPostWithTitle?title=${title}`);
  }

  getPostByAuthor(author: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/findByAuthor?author=${author}`);
  }

  getPostByContent(concept: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/findByContent?content=${concept}`);
  }

  getPostByDate(date: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/findByDate?date=${date}`);
  }

  updatePost(post: Post, userRole: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/update/${post.id}`, post, {headers : {'User-Role': userRole}});
  }
}
