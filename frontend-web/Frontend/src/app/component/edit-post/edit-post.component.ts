import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../../shared/models/post/post.model';
import {FormsModule} from '@angular/forms';
import {PostsService} from '../../services/posts.service';
import {DatePipe} from '@angular/common';
import {NavbarComponent} from '../navbar/navbar.component';
import {ReviewService} from '../../services/review.service';

@Component({
  selector: 'app-edit-post',
  imports: [
    FormsModule,
    NavbarComponent
  ],
  standalone: true,
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css',
  providers: [DatePipe]
})
export class EditPostComponent implements OnInit {
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

  constructor(private readonly postService: PostsService, private readonly reviewService: ReviewService ,private readonly datePipe: DatePipe) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params['id']);
    this.postId = this.route.snapshot.params['id'];
    this.postService.getPostById(this.postId).subscribe({
      next:(data) => {
        console.log(data);
        this.post = data;
        this.newTitle = this.post.title;
        this.newContent = this.post.content;
        this.newAuthor = this.post.author;
        this.newDate = this.datePipe.transform(this.post.date, 'yyyy-MM-dd')!;
        this.concept = this.post.concept;
      },
      error:(error) => {
        console.error('Error fetching post:', error);
      }
    });
  }

  updatePost() {
    this.post.title = this.newTitle;
    this.post.content = this.newContent;
    this.post.author = this.newAuthor;
    this.post.date = this.newDate;
    console.log(this.post);
    this.postService.updatePost(this.post, this.userRole).subscribe({
      next:(data) => {
        console.log('Post updated:', data);
        if (this.post.concept) {
          this.router.navigate(['/concepts']);
        } else {
          this.router.navigate(['/posts']);
        }
      },
      error:(error) => {
        console.error('Error updating post:', error);
      }
    });
  }

  cancelEdit() {
    if (this.post.concept != null) {
      this.router.navigate(['/concepts']);
    } else {
      this.router.navigate(['/posts']);
    }
  }
}
