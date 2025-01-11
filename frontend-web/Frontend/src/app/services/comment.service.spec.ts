import { TestBed } from '@angular/core/testing';
import { CommentService } from './comment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Comment } from '../shared/models/post/comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve comments', () => {
    const dummyComments: Comment[] = [
      { id: 1, content: 'Test Comment 1', author: 'Author 1', postId: 1 },
      { id: 2, content: 'Test Comment 2', author: 'Author 2', postId: 1 }
    ];

    service.getComments().subscribe(comments => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(dummyComments);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyComments);
  });

  it('should add a comment', () => {
    const newComment: Comment = { id: 3, content: 'New Comment', author: 'Author 3', postId: 1 };

    service.addComment('1', newComment).subscribe(comment => {
      expect(comment).toEqual(newComment);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('POST');
    req.flush(newComment);
  });

  it('should retrieve a comment by id', () => {
    const dummyComment: Comment = { id: 1, content: 'Test Comment', author: 'Author 1', postId: 1 };

    service.getCommentById(1).subscribe(comment => {
      expect(comment).toEqual(dummyComment);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyComment);
  });

  it('should retrieve a comment by author', () => {
    const dummyComment: Comment = { id: 1, content: 'Test Comment', author: 'Author 1', postId: 1 };

    service.getCommentByAuthor('Author 1').subscribe(comment => {
      expect(comment).toEqual(dummyComment);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/findByAuthor?author=Author 1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyComment);
  });

  it('should update a comment', () => {
    const updatedComment: Comment = { id: 1, content: 'Updated Comment', author: 'Author 1', postId: 1 };

    service.updateComment(1, updatedComment).subscribe(comment => {
      expect(comment).toEqual(updatedComment);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedComment);
  });

  it('should delete a comment', () => {
    const dummyComment: Comment = { id: 1, content: 'Test Comment', author: 'Author 1', postId: 1 };

    service.deleteComment(1).subscribe(comment => {
      expect(comment).toEqual(dummyComment);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyComment);
  });
});
