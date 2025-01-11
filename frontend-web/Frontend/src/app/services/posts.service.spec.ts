import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { Post } from '../shared/models/post/post.model';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostsService]
    });
    service = TestBed.inject(PostsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch posts', () => {
    const dummyPosts: Post[] = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false
    }];
    service.getPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should fetch concept posts', () => {
    const dummyPosts: Post[] = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false
    }];
    service.getConceptPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/concept`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should fetch published posts', () => {
    const dummyPosts: Post[] = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false }];
    service.getPublishedPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/published`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should add a post', () => {
    const newPost: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false };
    service.addPost(newPost, 'admin').subscribe(post => {
      expect(post).toEqual(newPost);
    });
    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('User-Role')).toBe('admin');
    req.flush(newPost);
  });

  it('should fetch post by title', () => {
    const dummyPost: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false};
    service.getPostByTitle('Test Post').subscribe(post => {
      expect(post).toEqual(dummyPost);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/findByTitle?title=Test Post`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPost);
  });

  it('should fetch post by id', () => {
    const dummyPost: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false};
    service.getPostById(1).subscribe(post => {
      expect(post).toEqual(dummyPost);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/findById/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPost);
  });

  it('should fetch all posts by title', () => {
    const dummyPosts: Post[] = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false }];
    service.getAllPostsByTitle('Test Post').subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/findAllPostWithTitle?title=Test Post`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should fetch posts by author', () => {
    const dummyPosts: Post[] = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false }];
    service.getPostByAuthor('Author').subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/findByAuthor?author=Author`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should fetch posts by content', () => {
    const dummyPosts: Post[] = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false}];
    service.getPostByContent('Test Content').subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/findByContent?content=Test Content`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should fetch posts by date', () => {
    const dummyPosts: Post[] = [{
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false }];
    service.getPostByDate('2023-01-01').subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts).toEqual(dummyPosts);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/findByDate?date=2023-01-01`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('should update a post', () => {
    const updatedPost: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false };
    service.updatePost(updatedPost, 'admin').subscribe(post => {
      expect(post).toEqual(updatedPost);
    });
    const req = httpMock.expectOne(`${service['apiUrl']}/update/1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('User-Role')).toBe('admin');
    req.flush(updatedPost);
  });
});
