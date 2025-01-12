import { Routes } from '@angular/router';
import {EditPostComponent} from './component/edit-post/edit-post.component';
import {PostsComponent} from './component/posts/posts.component';
import {ConceptPostsComponent} from './component/concept-posts/concept-posts.component';
import {AddPostComponent} from './component/add-post/add-post.component';
import {LoginComponent} from './component/login/login.component';
import {ReviewPostComponent} from './component/review-post/review-post.component';
import {ReviewDetailsComponent} from './component/review-details/review-details.component';
import {CommentsComponent} from './component/comments/comments.component';
import {AddCommentComponent} from './component/add-comment/add-comment.component';
import {EditCommentComponent} from './component/edit-comment/edit-comment.component';
import {AuthGuard} from './auth.guard';

export const routes: Routes = [
  {path: 'editPost/:id', component: EditPostComponent, canActivate: [AuthGuard]},
  {path: 'posts', component: PostsComponent, canActivate: [AuthGuard]},
  {path: 'concepts', component: ConceptPostsComponent, canActivate: [AuthGuard]},
  {path: 'addPost', component: AddPostComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'review/:id', component: ReviewPostComponent, canActivate: [AuthGuard]},
  {path: 'postDetails/:id', component: ReviewDetailsComponent, canActivate: [AuthGuard]},
  {path: 'comments/:id', component: CommentsComponent, canActivate: [AuthGuard]},
  {path: 'createComment/:id', component: AddCommentComponent, canActivate: [AuthGuard]},
  {path: 'editComment/:postId/:id', component: EditCommentComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];
