import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {FormsModule, ReactiveFormsModule, FormGroup, FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommentService} from '../../services/comment.service';
import {Comment} from '../../shared/models/post/comment.model';

@Component({
  selector: 'app-add-comment',
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    RouterLink,
    FormsModule
  ],
  standalone: true,
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent implements OnInit{
  content!: string;
  author!: string | null;
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  comment!: Comment;
  commentForm: FormGroup;

  constructor(private readonly commentService: CommentService, private readonly formBuilder: FormBuilder) {
    this.commentForm = this.formBuilder.group({
      author: localStorage.getItem('username'),
      content: ''
    });
  }

  ngOnInit(): void {
    this.author = localStorage.getItem('username');
  }

  addComment() {
    if (this.author) {
      this.comment = {
        content: this.commentForm.value.content,
        author: localStorage.getItem('username'),
        postId: this.route.snapshot.params['id']
      } as Comment;
    }

    this.commentService.addComment(this.route.snapshot.params['id'], this.comment).subscribe({
      next:(response) => {
        console.log('Comment added successfully:', response);
        this.router.navigate(['/posts']);
      },
      error:(error) => {
        console.error('Error adding comment:', error);
      }
    });

  }
}
