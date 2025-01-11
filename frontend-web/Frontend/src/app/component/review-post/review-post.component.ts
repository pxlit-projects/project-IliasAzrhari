import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../../shared/models/post/post.model';
import {PostsService} from '../../services/posts.service';
import {DatePipe} from '@angular/common';
import {ReviewService} from '../../services/review.service';
import {Review} from '../../shared/models/post/review.model';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-review-post',
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe],
  standalone: true,
  templateUrl: './review-post.component.html',
  styleUrl: './review-post.component.css'
})
export class ReviewPostComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  post!: Post;
  router: Router = inject(Router);
  userRole: string = localStorage.getItem('role') || '';
  postId!: number;
  newTitle!: string;
  newContent!: string;
  newAuthor!: string;
  newDate!: string;
  concept!: boolean;
  reviewMessage!: string;
  review: Review = {description: '', approved: false};

  constructor(private readonly postService: PostsService, private readonly reviewService: ReviewService ,private readonly datePipe: DatePipe, private readonly  notificationService: NotificationService) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params['id']);
    this.postId = this.route.snapshot.params['id'];
    this.postService.getPostById(this.postId).subscribe({
      next: (data) => {
        console.log(data);
        this.post = data;
        this.newTitle = this.post.title;
        this.newContent = this.post.content;
        this.newAuthor = this.post.author;
        this.newDate = this.datePipe.transform(this.post.date, 'yyyy-MM-dd')!;
        this.concept = this.post.concept;
      },
      error: (error) => {
        console.error('Error fetching post:', error);
      }
    });
  }

  approvePost() {
    this.review.approved = true;
    this.review.description = this.reviewMessage;
    this.notificationService.addNotification(this.post.title + ' has been approved');
    console.log(this.review);
    this.reviewService.reviewPost(this.postId, this.review, this.userRole).subscribe({
      next: (data) => {
        console.log('Post reviewed:', data);
        this.router.navigate(['/posts'])
      },
      error: (error) => {
        console.error('Error reviewing post:', error);
      }
    });
  }

  rejectPost() {
    this.review.approved = false;
    this.review.description = this.reviewMessage;
    this.notificationService.addNotification(this.post.title + ' has been rejected');
    console.log(this.review);
    this.reviewService.reviewPost(this.postId, this.review, this.userRole).subscribe({
      next: (data) => {
        console.log('Post reviewed:', data);
        this.router.navigate(['/concepts'])
      },
      error: (error) => {
        console.error('Error reviewing post:', error);
      }
    });
  }

  cancelReview() {
    this.router.navigate(['/concepts']);
  }
}
