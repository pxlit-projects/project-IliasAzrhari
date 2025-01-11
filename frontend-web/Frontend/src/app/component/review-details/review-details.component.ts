import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PostsService} from '../../services/posts.service';
import {ReviewService} from '../../services/review.service';
import {Post} from '../../shared/models/post/post.model';
import {Review} from '../../shared/models/post/review.model';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-review-details',
  imports: [
    NavbarComponent
  ],
  standalone: true,
  templateUrl: './review-details.component.html',
  styleUrl: './review-details.component.css'
})
export class ReviewDetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  post!: Post;
  reviews!: Review[];

  constructor(private readonly postService: PostsService, private readonly reviewService: ReviewService) {}

  ngOnInit(): void {
    this.postService.getPostById(this.route.snapshot.params['id']).subscribe({
      next:(data) => {
        this.post = data;
      },
      error:(error) => {
        console.error('Error fetching post:', error);
      }
    });

    this.reviewService.getReviews(this.route.snapshot.params['id']).subscribe({
      next:(data) => {
        this.reviews = data;
      },
      error:(error) => {
        console.error('Error fetching review:', error);
      }
    });
  }

}
