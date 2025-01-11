import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommentService} from '../../services/comment.service';
import {Comment} from '../../shared/models/post/comment.model';
import {NavbarComponent} from '../navbar/navbar.component';
@Component({
  selector: 'app-comments',
  imports: [
    NavbarComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  comments!: Comment[]
  postId!: number;
  currentUser = localStorage.getItem('username');

  constructor(private readonly commentService: CommentService){}

  ngOnInit(): void {
    this.postId = this.route.snapshot.params['id'];
    this.commentService.getComments().subscribe({
      next:(data) => {
        console.log(data);
        this.comments = data.filter(comment => comment.postId == this.postId);
      },
      error:(error) => {
        console.error('Error fetching comments:', error);
      }
    });
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(id).subscribe({
      next:(data) => {
        console.log('Comment deleted:', data);
        this.router.navigate(['/posts']);
      },
      error:(error) => {
        console.error('Error deleting comment:', error);
      }
    });
  }
}
