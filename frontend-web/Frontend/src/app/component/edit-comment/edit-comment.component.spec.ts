import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCommentComponent } from './edit-comment.component';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Comment } from '../../shared/models/post/comment.model';

describe('EditCommentComponent', () => {
  let component: EditCommentComponent;
  let fixture: ComponentFixture<EditCommentComponent>;
  let commentServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    commentServiceMock = {
      getCommentById: jasmine.createSpy('getCommentById').and.returnValue(of({})),
      updateComment: jasmine.createSpy('updateComment').and.returnValue(of({}))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    activatedRouteMock = {
      snapshot: {
        params: {
          id: '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EditCommentComponent],
      providers: [
        { provide: CommentService, useValue: commentServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch comment on init', () => {
    const comment: Comment = { id: 1, content: 'Test content', author: 'Test author', postId: 123 };
    commentServiceMock.getCommentById.and.returnValue(of(comment));

    component.ngOnInit();

    expect(commentServiceMock.getCommentById).toHaveBeenCalledWith('1');
    expect(component.comment).toEqual(comment);
    expect(component.content).toBe('Test content');
    expect(component.author).toBe('Test author');
  });

  it('should handle error when fetching comment', () => {
    const error = new Error('Error fetching comment');
    commentServiceMock.getCommentById.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(commentServiceMock.getCommentById).toHaveBeenCalledWith('1');
    expect(console.error).toHaveBeenCalledWith('Error fetching comment:', error);
  });

  it('should update comment', () => {
    const comment: Comment = { id: 1, content: 'Updated content', author: 'Updated author', postId: 123 };
    component.comment = comment;
    component.content = 'Updated content';
    component.author = 'Updated author';
    commentServiceMock.updateComment.and.returnValue(of(comment));

    component.updateComment();

    expect(commentServiceMock.updateComment).toHaveBeenCalledWith('1', comment);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should handle error when updating comment', () => {
    const error = new Error('Error updating comment');
    commentServiceMock.updateComment.and.returnValue(throwError(error));
    spyOn(console, 'error');

    component.updateComment();

    expect(commentServiceMock.updateComment).toHaveBeenCalledWith('1', component.comment);
    expect(console.error).toHaveBeenCalledWith('Error updating comment:', error);
  });

  it('should navigate to posts on cancel', () => {
    component.cancelEdit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });
});
