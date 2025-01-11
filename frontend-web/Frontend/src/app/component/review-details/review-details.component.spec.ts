import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { ReviewService } from '../../services/review.service';
import { Post } from '../../shared/models/post/post.model';
import { Review } from '../../shared/models/post/review.model';
import { ReviewDetailsComponent } from './review-details.component';

describe('ReviewDetailsComponent', () => {
  let component: ReviewDetailsComponent;
  let fixture: ComponentFixture<ReviewDetailsComponent>;
  let mockPostsService: jasmine.SpyObj<PostsService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockPostsService = jasmine.createSpyObj('PostsService', ['getPostById']);
    mockReviewService = jasmine.createSpyObj('ReviewService', ['getReviews']);
    mockActivatedRoute = {
      snapshot: {
        params: {
          id: '123'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ReviewDetailsComponent],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post on init', () => {
    const post: Post = {
      id: 123,
      title: 'Test Post',
      content: 'Test Content',
      author: 'Author',
      date: '2025-01-01',
      concept: true
    };
    mockPostsService.getPostById.and.returnValue(of(post));

    component.ngOnInit();

    expect(mockPostsService.getPostById).toHaveBeenCalledWith(123);
    expect(component.post).toEqual(post);
  });

  it('should handle error when fetching post', () => {
    mockPostsService.getPostById.and.returnValue(throwError('Error fetching post'));

    spyOn(console, 'error');
    component.ngOnInit();

    expect(mockPostsService.getPostById).toHaveBeenCalledWith(123);
    expect(console.error).toHaveBeenCalledWith('Error fetching post:', 'Error fetching post');
  });

  it('should fetch reviews on init', () => {
    const reviews: Review[] = [{ description: 'Great review', approved: true }];
    mockReviewService.getReviews.and.returnValue(of(reviews));

    component.ngOnInit();

    expect(mockReviewService.getReviews).toHaveBeenCalledWith(123);
    expect(component.reviews).toEqual(reviews);
  });

  it('should handle error when fetching reviews', () => {
    mockReviewService.getReviews.and.returnValue(throwError('Error fetching review'));

    spyOn(console, 'error');
    component.ngOnInit();

    expect(mockReviewService.getReviews).toHaveBeenCalledWith(123);
    expect(console.error).toHaveBeenCalledWith('Error fetching review:', 'Error fetching review');
  });
});
