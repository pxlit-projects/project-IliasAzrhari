import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchbarComponent } from './searchbar.component';
import { PostsService } from '../../services/posts.service';
import { of, throwError } from 'rxjs';
import { PostsComponent } from '../posts/posts.component';
import { Router } from '@angular/router';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;
  let postsService: jasmine.SpyObj<PostsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', ['getPublishedPosts', 'getAllPostsByTitle', 'getPostByAuthor', 'getPostByContent', 'getPostByDate']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SearchbarComponent],
      providers: [
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown visibility', () => {
    component.isDropdownVisible = false;
    component.toggleDropdown();
    expect(component.isDropdownVisible).toBeTrue();
    component.toggleDropdown();
    expect(component.isDropdownVisible).toBeFalse();
  });

  it('should set filter and reset search value', () => {
    component.setFilter('Titel');
    expect(component.filter).toBe('Titel');
    expect(component.searchValue).toBe('');
    expect(component.showDatePicker).toBeFalse();

    component.setFilter('Datum');
    expect(component.filter).toBe('Datum');
    expect(component.searchValue).toBe('');
    expect(component.showDatePicker).toBeTrue();
  });

  it('should fetch published posts on init', () => {
    const mockPosts = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false
    }];
    postsService.getPublishedPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(postsService.getPublishedPosts).toHaveBeenCalled();
    expect(component.postsComponent.allPosts).toEqual(mockPosts);
  });

  it('should handle error when fetching published posts', () => {
    const error = new Error('Error fetching posts');
    postsService.getPublishedPosts.and.returnValue(throwError(error));

    spyOn(console, 'error');
    component.ngOnInit();

    expect(postsService.getPublishedPosts).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching posts:', error);
  });

  it('should search posts by title', () => {
    const mockPosts = [{ id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false }];
    component.searchValue = 'Test';
    postsService.getAllPostsByTitle.and.returnValue(of(mockPosts));

    component.searchOnFilter('Titel');

    expect(postsService.getAllPostsByTitle).toHaveBeenCalledWith('Test');
    expect(component.postsComponent.allPosts).toEqual(mockPosts);
  });

  it('should handle error when searching posts by title', () => {
    const error = new Error('Error fetching post');
    component.searchValue = 'Test';
    postsService.getAllPostsByTitle.and.returnValue(throwError(error));

    spyOn(console, 'error');
    component.searchOnFilter('Titel');

    expect(postsService.getAllPostsByTitle).toHaveBeenCalledWith('Test');
    expect(console.error).toHaveBeenCalledWith('Error fetching post:', error);
  });

});
