import {Component, inject, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {PostsService} from '../../services/posts.service';
import {Post} from '../../shared/models/post/post.model';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {PostsComponent} from '../posts/posts.component';

@Component({
  selector: 'app-searchbar',
  imports: [
    NgClass,
    FormsModule
  ],
  standalone: true,
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  router: Router = inject(Router);
  isDropdownVisible: boolean = false;
  filter: string = "Filter";
  searchValue!: string;
  posts!: Post[];
  dateValue!: string;
  @Input() postsComponent!: PostsComponent;

  constructor(private readonly postService: PostsService) {
  }

  ngOnInit(): void {
    this.postService.getPublishedPosts().subscribe(
      (data) => {
        this.postsComponent.allPosts = data;
        console.log('Posts:', data);
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  setFilter(filter: string) {
    this.filter = filter;
    this.isDropdownVisible = false;

  }

  searchOnFilter(filter: string) {
    if (filter === 'Titel'){
      this.postService.getAllPostsByTitle(this.searchValue).subscribe(
        (data) => {
          console.log(data);
          this.postsComponent.allPosts = data;
          console.log(this.searchValue);
          console.log(this.posts);
        },
        (error) => {
          console.error('Error fetching post:', error);
        }
      );
    }else if(filter === 'Auteur'){
      this.postService.getPostByAuthor(this.searchValue).subscribe(
        (data) => {
          console.log(data);
          this.postsComponent.allPosts = data;
          console.log(this.posts);
        },
        (error) => {
          console.error('Error fetching post:', error);
        }
      );
    }else if(filter === 'Inhoud'){
      this.postService.getPostByContent(this.searchValue).subscribe(
        (data) => {
          console.log(data);
          this.postsComponent.allPosts = data;
        },
        (error) => {
          console.error('Error fetching post:', error);
        }
      );

    }else if(filter === 'Datum'){
      //convert string to date
      this.dateValue = this.searchValue;
      this.postService.getPostByDate(this.dateValue).subscribe(
        (data) => {
          console.log(data);
          this.postsComponent.allPosts = data;
        },
        (error) => {
          console.error('Error fetching post:', error);
        }
      );
    }

  }
}
