import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EditPostComponent } from './edit-post.component';
import { PostsService } from '../../services/posts.service';
import { ReviewService } from '../../services/review.service';
import { DatePipe } from '@angular/common';
import { Post } from '../../shared/models/post/post.model';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let mockPostsService: jasmine.SpyObj<PostsService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockPostsService = jasmine.createSpyObj('PostsService', ['getPostById', 'updatePost']);
    mockReviewService = jasmine.createSpyObj('ReviewService', ['']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        params: { id: 1 }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EditPostComponent],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post on init', () => {
    const post: Post = { id: 1, title: 'Test', content: 'Test content', author: 'Author', date: '2023-01-01', concept: false };
    mockPostsService.getPostById.and.returnValue(of(post));

    component.ngOnInit();

    expect(mockPostsService.getPostById).toHaveBeenCalledWith(1);
    expect(component.post).toEqual(post);
    expect(component.newTitle).toBe(post.title);
    expect(component.newContent).toBe(post.content);
    expect(component.newAuthor).toBe(post.author);
    expect(component.newDate).toBe('2023-01-01');
    expect(component.concept).toBe(post.concept);
  });

  it('should handle error when fetching post', () => {
    mockPostsService.getPostById.and.returnValue(throwError('Error'));

    component.ngOnInit();

    expect(mockPostsService.getPostById).toHaveBeenCalledWith(1);
    expect(component.post).toBeUndefined();
  });

  it('should update post and navigate', () => {
    const post: Post = { id: 1, title: 'Test', content: 'Test content', author: 'Author', date: '2023-01-01', concept: false };
    component.post = post;
    component.newTitle = 'Updated Title';
    component.newContent = 'Updated Content';
    component.newAuthor = 'Updated Author';
    component.newDate = '2023-01-02';
    mockPostsService.updatePost.and.returnValue(of(post));

    component.updatePost();

    expect(mockPostsService.updatePost).toHaveBeenCalledWith(post, component.userRole);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should handle error when updating post', () => {
    const post: Post = { id: 1, title: 'Test', content: 'Test content', author: 'Author', date: '2023-01-01', concept: false };
    component.post = post;
    mockPostsService.updatePost.and.returnValue(throwError('Error'));

    component.updatePost();

    expect(mockPostsService.updatePost).toHaveBeenCalledWith(post, component.userRole);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to concepts or posts on cancelEdit', () => {
    component.post = { id: 1, title: 'Test', content: 'Test content', author: 'Author', date: '2023-01-01', concept: true };
    component.cancelEdit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/concepts']);

    component.post.concept = false;
    component.cancelEdit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });
});
