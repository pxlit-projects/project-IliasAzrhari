import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {CommentService} from '../../services/comment.service';
import {Comment} from '../../shared/models/post/comment.model';

@Component({
  selector: 'app-edit-comment',
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  standalone: true,
  templateUrl: './edit-comment.component.html',
  styleUrl: './edit-comment.component.css'
})
export class EditCommentComponent implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  comment!: Comment;
  author!: string;
  content!: string;
  constructor(private readonly commentService: CommentService) {}

  ngOnInit() {
    this.commentService.getCommentById(this.route.snapshot.params['id']).subscribe({
      next:(data) => {
        console.log(data);
        this.comment = data;
        this.content = this.comment.content;
        this.author = this.comment.author;
      },
      error:(error) => {
        console.error('Error fetching comment:', error);
      }
    });
  }
  updateComment() {
    this.comment.content = this.content;
    this.comment.author = this.author;
    console.log(this.comment);
    this.commentService.updateComment(this.route.snapshot.params['id'], this.comment).subscribe({
      next:(data) => {
        console.log('Comment updated:', data);
        this.router.navigate(['/posts']);
      },
      error:(error) => {
        console.error('Error updating comment:', error);
      }
    });
  }

  cancelEdit() {
    this.router.navigate(['/posts']);
  }
}
