import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewPostComponent } from './review-post.component';
import { PostsService } from '../../services/posts.service';
import { ReviewService } from '../../services/review.service';
import { NotificationService } from '../../services/notification.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ReviewPostComponent', () => {
  let component: ReviewPostComponent;
  let fixture: ComponentFixture<ReviewPostComponent>;
  let postsService: jasmine.SpyObj<PostsService>;
  let reviewService: jasmine.SpyObj<ReviewService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', ['getPostById']);
    const reviewServiceSpy = jasmine.createSpyObj('ReviewService', ['reviewPost']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['addNotification']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReviewPostComponent],
      providers: [
        DatePipe,
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: ReviewService, useValue: reviewServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        //{ provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } } } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } }, params: of({ id: 1 }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewPostComponent);
    component = fixture.componentInstance;
    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    reviewService = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post on init', () => {
    const post = { id: 1, title: 'Test Post', content: 'Test Content', author: 'Author', date: '2025-01-01', concept: true };
    postsService.getPostById.and.returnValue(of(post));

    component.ngOnInit();

    expect(postsService.getPostById).toHaveBeenCalledWith(1);
    expect(component.post).toEqual(post);
  });

  it('should handle error when fetching post', () => {
    postsService.getPostById.and.returnValue(throwError('Error'));

    component.ngOnInit();

    expect(postsService.getPostById).toHaveBeenCalledWith(1);
    expect(component.post).toBeUndefined();
  });

  it('should approve post', () => {
    component.reviewMessage = 'Approved';
    component.post = { id: 1, title: 'Test Post', content: 'Test Content', author: 'Author', date: '2025-01-01', concept: true };
   // reviewService.reviewPost.and.returnValue(of({}));

    component.approvePost();

    expect(component.review.approved).toBeTrue();
    expect(notificationService.addNotification).toHaveBeenCalledWith('Test Post has been approved');
    expect(reviewService.reviewPost).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should reject post', () => {
    component.reviewMessage = 'Rejected';
    component.post = { id: 1, title: 'Test Post', content: 'Test Content', author: 'Author', date: '2025-01-01', concept: true };
    //reviewService.reviewPost.and.returnValue(of({}));

    component.rejectPost();

    expect(component.review.approved).toBeFalse();
    expect(notificationService.addNotification).toHaveBeenCalledWith('Test Post has been rejected');
    expect(reviewService.reviewPost).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/concepts']);
  });

  it('should navigate to concepts on cancel', () => {
    component.cancelReview();

    expect(router.navigate).toHaveBeenCalledWith(['/concepts']);
  });
});
