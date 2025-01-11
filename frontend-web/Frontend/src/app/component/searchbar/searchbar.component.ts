import {Component, inject, Input, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {PostsService} from '../../services/posts.service';
import {Post} from '../../shared/models/post/post.model';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {PostsComponent} from '../posts/posts.component';
import {DatepickerComponent} from '../datepicker/datepicker.component';

@Component({
  selector: 'app-searchbar',
  imports: [
    NgClass,
    FormsModule,
    DatepickerComponent
  ],
  standalone: true,
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit {
  router: Router = inject(Router);
  isDropdownVisible: boolean = false;
  filter: string = "Filter";
  searchValue!: string;
  posts!: Post[];
  dateValue!: string;
  @Input() postsComponent!: PostsComponent;
  showDatePicker: boolean = false;

  constructor(private readonly postService: PostsService) {
  }

  ngOnInit(): void {
    this.postService.getPublishedPosts().subscribe({
      next: (data) => {
        this.postsComponent.allPosts = data;
        console.log('Posts:', data);
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  setFilter(filter: string) {
    this.filter = filter;
    this.searchValue = '';
    if(filter === 'Datum'){
      this.showDatePicker = true;
    }
    this.isDropdownVisible = false;

  }

  searchOnFilter(filter: string) {
    if (filter === 'Titel'){
      this.postService.getAllPostsByTitle(this.searchValue).subscribe({
        next: (data) => {
          console.log(data);
          this.postsComponent.allPosts = data;
        },
        error: (error) => {
          console.error('Error fetching post:', error);
        }
      });
    }else if(filter === 'Auteur'){
      this.postService.getPostByAuthor(this.searchValue).subscribe({
        next: (data) => {
          console.log(data);
          this.postsComponent.allPosts = data;
        },
        error: (error) => {
          console.error('Error fetching post:', error);
        }
      });
    }else if(filter === 'Inhoud'){
      this.postService.getPostByContent(this.searchValue).subscribe({
        next: (data) => {
          console.log(data);
          this.postsComponent.allPosts = data;
        },
        error: (error) => {
          console.error('Error fetching post:', error);
        }
      });

    }else if(filter === 'Datum'){
      this.dateValue = this.searchValue;
      this.postService.getPostByDate(this.dateValue).subscribe({
        next: (data) => {
          console.log(data);
          this.postsComponent.allPosts = data;
        },
        error: (error) => {
          console.error('Error fetching post:', error);
        }
      });
    }

  }
}
