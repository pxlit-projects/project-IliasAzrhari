import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PostsService} from '../../services/posts.service';
import {Post} from '../../shared/models/post/post.model';
import {Router, RouterLink} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-add-post',
  imports: [
    FormsModule,
    RouterLink,
    NavbarComponent
  ],
  standalone: true,
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  router: Router = inject(Router);
  author!: string;
  title!: string;
  content!: string;
  date!: string;
  post!: Post;

  constructor(private readonly postService: PostsService) { }

  addPost() {
    this.post = {
      title: this.title,
      author: this.author,
      content: this.content,
      date: this.date
    } as Post;
    this.postService.addPost(this.post).subscribe(
      (response) => {
        console.log('Post added successfully:', response);
        this.router.navigate(['/posts']);

      },
      (error) => {
        console.error('Error adding post:', error);
      });
  }

}
