import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCommentComponent } from './add-comment.component';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

describe('AddCommentComponent', () => {
  let component: AddCommentComponent;
  let fixture: ComponentFixture<AddCommentComponent>;
  let commentService: jasmine.SpyObj<CommentService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const commentServiceSpy = jasmine.createSpyObj('CommentService', ['addComment']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, AddCommentComponent, NavbarComponent],
      providers: [
        { provide: CommentService, useValue: commentServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCommentComponent);
    component = fixture.componentInstance;
    commentService = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges(); // Ensure component initialization
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize author on ngOnInit', () => {
    spyOn(localStorage, 'getItem').and.returnValue('testUser');
    component.ngOnInit();
    expect(component.author).toBe('testUser');
  });

  it('should call addComment and navigate on success', () => {
    spyOn(localStorage, 'getItem').and.returnValue('testUser');
    component.content = 'Test comment';
    const comment = { id: 1, content: 'Test comment', author: 'testUser', postId: 5 };
    commentService.addComment.and.returnValue(of(comment));

    component.addComment();

    expect(commentService.addComment).toHaveBeenCalledWith('1', comment);
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });


  it('should log error on addComment failure', () => {
    spyOn(localStorage, 'getItem').and.returnValue('testUser');
    component.content = 'Test comment';
    const error = new Error('Test error');
    commentService.addComment.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.addComment();

    expect(commentService.addComment).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error adding comment:', error);
  });
});
