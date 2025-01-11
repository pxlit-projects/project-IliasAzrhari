import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import { AddPostComponent } from './add-post.component';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/models/post/post.model';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let postService: jasmine.SpyObj<PostsService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    postService = jasmine.createSpyObj('PostsService', ['addPost']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddPostComponent],
      providers: [
        { provide: PostsService, useValue: postService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: {snapshot: {params: { id: 1}}} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a post successfully', () => {
    const mockPost: Post = {
      id: 1,
      title: 'Test Title',
      author: 'Test Author',
      content: 'Test Content',
      date: '2023-01-01',
      concept: false
    };
    const mockRole = 'editor';
    component.title = mockPost.title;
    component.author = mockPost.author;
    component.content = mockPost.content;
    component.date = mockPost.date;

    postService.addPost.and.returnValue({subscribe: () => {} } as any);

    component.addPost();

    expect(postService.addPost).toHaveBeenCalledWith(mockPost, mockRole);
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should handle error when adding a post', () => {
    const mockError = new Error('Test Error');
    postService.addPost.and.returnValue(throwError(mockError));

    component.addPost();

    expect(postService.addPost).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should toggle datePickerVisible', () => {
    expect(component.datePickerVisible).toBeFalse();
    component.showDatePicker();
    expect(component.datePickerVisible).toBeTrue();
    component.showDatePicker();
    expect(component.datePickerVisible).toBeFalse();
  });
});
