import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post} from '../shared/models/post/post.model';
import {Comment} from '../shared/models/post/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly apiUrl = "http://localhost:8095/comment/api/comments"
  constructor(private readonly http: HttpClient) { }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }

  addComment(postId: string, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${postId}`, comment);
  }

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${id}`);
  }

  getCommentByAuthor(author: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/findByAuthor?author=${author}`);
  }

  updateComment(commentId: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}`, comment);
  }

  deleteComment(id: number): Observable<Comment> {
    return this.http.delete<Comment>(`${this.apiUrl}/${id}`);
  }

}
