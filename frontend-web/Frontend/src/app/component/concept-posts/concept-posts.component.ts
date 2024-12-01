import {Component, inject, OnInit} from '@angular/core';
import {Post} from '../../shared/models/post/post.model';
import {PostsService} from '../../services/posts.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';
import {SearchbarComponent} from '../searchbar/searchbar.component';

@Component({
  selector: 'app-concept-posts',
  imports: [
    RouterLink,
    NavbarComponent,
    SearchbarComponent
  ],
  standalone: true,
  templateUrl: './concept-posts.component.html',
  styleUrl: './concept-posts.component.css'
})
export class ConceptPostsComponent implements OnInit {
  conceptPosts!: Post[];
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  constructor(private readonly postService: PostsService) { }

  ngOnInit(): void {

    this.postService.getConceptPosts().subscribe(
      (data) => {
        this.conceptPosts = data;
        console.log('Posts:', data);
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }


}
