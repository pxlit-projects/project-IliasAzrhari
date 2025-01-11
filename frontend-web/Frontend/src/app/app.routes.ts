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

export const routes: Routes = [
  {path: 'editPost/:id', component: EditPostComponent},
  {path: 'posts', component: PostsComponent},
  {path: 'concepts', component: ConceptPostsComponent},
  {path: 'addPost', component: AddPostComponent},
  {path: 'login', component: LoginComponent},
  {path: 'review/:id', component: ReviewPostComponent},
  {path: 'postDetails/:id', component: ReviewDetailsComponent},
  {path: 'comments/:id', component: CommentsComponent},
  {path: 'createComment/:id', component: AddCommentComponent},
  {path: 'editComment/:postId/:id', component: EditCommentComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];
