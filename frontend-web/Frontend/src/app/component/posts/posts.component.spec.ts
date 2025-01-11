import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PostsComponent } from './posts.component';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/models/post/post.model';
import { ActivatedRoute } from '@angular/router';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let mockPostsService: jasmine.SpyObj<PostsService>;

  beforeEach(async () => {
    mockPostsService = jasmine.createSpyObj('PostsService', ['getPublishedPosts']);

    await TestBed.configureTestingModule({
      imports: [PostsComponent],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and set allPosts on init', () => {
    const mockPosts: Post[] = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'Author',
      date: '2025-01-01',
      concept: true
    }];
    mockPostsService.getPublishedPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(component.allPosts).toEqual(mockPosts);
    expect(mockPostsService.getPublishedPosts).toHaveBeenCalled();
  });

  it('should log error when fetching posts fails', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    mockPostsService.getPublishedPosts.and.returnValue(throwError('Error'));

    component.ngOnInit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching posts:', 'Error');
  });

  it('should set loggedInUser and role from localStorage', () => {
    localStorage.setItem('username', 'testUser');
    localStorage.setItem('role', 'admin');

    component.ngOnInit();

    expect(component.loggedInUser).toBe('testUser');
    expect(component.role).toBe('admin');
  });
});
