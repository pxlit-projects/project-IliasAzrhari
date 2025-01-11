import {Component, inject, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {PostsService} from '../../services/posts.service';
import {Post} from '../../shared/models/post/post.model';
import {Router, RouterLink} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';
import {DatepickerComponent} from '../datepicker/datepicker.component';

@Component({
  selector: 'app-add-post',
  imports: [
    FormsModule,
    RouterLink,
    NavbarComponent,
    DatepickerComponent
  ],
  standalone: true,
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  router: Router = inject(Router);
  author: string = localStorage.getItem('username') || '';
  userRole: string = localStorage.getItem('role') || '';
  title!: string;
  content!: string;
  date!: string;
  post!: Post;
  datePickerVisible: boolean = false;

  constructor(private readonly postService: PostsService) { }

  addPost() {
    this.post = {
      title: this.title,
      author: this.author,
      content: this.content,
      date: this.date
    } as Post;
    this.postService.addPost(this.post, this.userRole).subscribe({
      next:(response) => {
        console.log('Post added successfully:', response);
        this.router.navigate(['/posts']);

      },
      error:(error) => {
        console.error('Error adding post:', error);
      }
    });
  }



  showDatePicker() {
    this.datePickerVisible = !this.datePickerVisible;
  }


}
