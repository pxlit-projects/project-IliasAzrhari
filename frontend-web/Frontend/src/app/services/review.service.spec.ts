import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { Review } from '../shared/models/post/review.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch reviews', () => {
    const dummyReviews: Review[] = [
      { description: 'Great post!', approved: true },
      { description: 'Very informative.', approved: true }
    ];

    service.getReviews(1).subscribe(reviews => {
      expect(reviews.length).toBe(2);
      expect(reviews).toEqual(dummyReviews);
    });

    const req = httpMock.expectOne('http://localhost:8095/review/api/reviews/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyReviews);
  });

  it('should review a post', () => {
    const dummyReview: Review = { description: 'Great post!', approved: true };

    service.reviewPost(1, dummyReview, 'admin').subscribe(review => {
      expect(review).toEqual(dummyReview);
    });

    const req = httpMock.expectOne('http://localhost:8095/review/api/reviews/review/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('User-Role')).toBe('admin');
    req.flush(dummyReview);
  });

  it('should delete a review', () => {
    const dummyReview: Review = { description: 'Great post!', approved: true };

    service.deleteReview(1).subscribe(review => {
      expect(review).toEqual(dummyReview);
    });

    const req = httpMock.expectOne('http://localhost:8095/review/api/reviews/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyReview);
  });
});
