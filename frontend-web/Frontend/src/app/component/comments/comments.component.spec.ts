import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from './comments.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../shared/models/post/comment.model';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;
  let mockCommentService: any;
  let mockComments: Comment[];

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        params: { id: 1 }
      }
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockCommentService = jasmine.createSpyObj('CommentService', ['getComments', 'deleteComment']);

    await TestBed.configureTestingModule({
      imports: [
        CommentsComponent,
        RouterTestingModule,
        CommonModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: CommentService, useValue: mockCommentService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
  });

  it('should fetch comments on init', () => {
    mockComments = [{
      id: 1, postId: 1, content: 'Test comment',
      author: 'ilias'
    }];
    mockCommentService.getComments.and.returnValue(of(mockComments));
    component.ngOnInit();
    expect(component.comments.length).toBe(1);
    expect(component.comments[0].content).toBe('Test comment');
    fixture.detectChanges();
  });

  it('should handle error when fetching comments', () => {
    mockCommentService.getComments.and.returnValue(throwError('Error'));
    spyOn(console, 'error');
    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('Error fetching comments:', 'Error');
  });

  it('should delete comment and navigate to posts', () => {
    mockCommentService.deleteComment.and.returnValue(of({}));
    component.deleteComment(1);
    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should handle error when deleting comment', () => {
    mockCommentService.deleteComment.and.returnValue(throwError('Error'));
    spyOn(console, 'error');
    component.deleteComment(1);
    expect(console.error).toHaveBeenCalledWith('Error deleting comment:', 'Error');
  });
});
