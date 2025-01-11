import {Component, inject, OnInit} from '@angular/core';
import {Post} from '../../shared/models/post/post.model';
import {PostsService} from '../../services/posts.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-concept-posts',
  imports: [
    RouterLink,
    NavbarComponent,
  ],
  standalone: true,
  templateUrl: './concept-posts.component.html',
  styleUrl: './concept-posts.component.css'
})
export class ConceptPostsComponent implements OnInit {
  conceptPosts!: Post[];
  // route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  constructor(private readonly postService: PostsService) { }

  ngOnInit(): void {

    this.postService.getConceptPosts().subscribe({
      next:(data) => {
        this.conceptPosts = data;
        console.log('Posts:', data);
      },
      error:(error) => {
        console.error('Error fetching posts:', error);
      }
    });
  }

}
