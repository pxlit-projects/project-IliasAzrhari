import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ConceptPostsComponent } from './concept-posts.component';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/models/post/post.model';

describe('ConceptPostsComponent', () => {
  let component: ConceptPostsComponent;
  let fixture: ComponentFixture<ConceptPostsComponent>;
  let postService: jasmine.SpyObj<PostsService>;

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj('PostsService', { getConceptPosts: of([]) });
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ConceptPostsComponent],
      providers: [{ provide: PostsService, useValue: postServiceSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConceptPostsComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch concept posts on init', () => {
    const mockPosts: Post[] = [{
      id: 1, title: 'Test Post', content: 'Test Content',
      author: 'ilias',
      date: '2025-01-01',
      concept: false
    }];
    postService.getConceptPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(component.conceptPosts).toEqual(mockPosts);
    expect(postService.getConceptPosts).toHaveBeenCalled();
  });

  it('should handle error when fetching concept posts', () => {
    const errorResponse = new Error('Error fetching posts');
    postService.getConceptPosts.and.returnValue(throwError(errorResponse));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(component.conceptPosts).toEqual([]);
    expect(postService.getConceptPosts).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching posts:', errorResponse);
  });
});
