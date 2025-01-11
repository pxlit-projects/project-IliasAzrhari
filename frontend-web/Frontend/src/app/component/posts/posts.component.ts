import {Component, OnInit} from '@angular/core';
import {SearchbarComponent} from '../searchbar/searchbar.component';
import {PostsService} from '../../services/posts.service';
import {Post} from '../../shared/models/post/post.model';
import {RouterLink} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-posts',
  imports: [
    SearchbarComponent,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './posts.component.html',
  standalone: true,
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit {
  allPosts!: Post[];
  loggedInUser = localStorage.getItem('username');
  role = localStorage.getItem('role');

  constructor(private readonly postService: PostsService) { }

  ngOnInit(): void {
    this.postService.getPublishedPosts().subscribe({
      next:(data) => {
        this.allPosts = data;
        console.log('Posts:', data);
        console.log('Logged post:', this.loggedInUser);
        console.log('Role:', this.role);
      },
      error:(error) => {
        console.error('Error fetching posts:', error);
      }
    });
  }
}
