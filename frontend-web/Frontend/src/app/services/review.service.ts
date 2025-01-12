import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Post} from '../shared/models/post/post.model';
import {Review} from '../shared/models/post/review.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = environment.apiUrl + "review/api/reviews"
  constructor(private readonly http: HttpClient) { }

  getReviews(postId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${postId}`);
  }

  reviewPost(postId: number, review: Review, userRole: string): Observable<Review> {
     return this.http.put<Review>(`${this.apiUrl}/review/${postId}`, review, {headers : {'User-Role': userRole}});
  }

  deleteReview(postId: number): Observable<Review> {
    return this.http.delete<Review>(`${this.apiUrl}/${postId}`);
  }


}
