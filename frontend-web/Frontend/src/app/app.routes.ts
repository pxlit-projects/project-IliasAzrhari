import { Routes } from '@angular/router';
import {EditPostComponent} from './component/edit-post/edit-post.component';
import {PostsComponent} from './component/posts/posts.component';
import {ConceptPostsComponent} from './component/concept-posts/concept-posts.component';
import {AddPostComponent} from './component/add-post/add-post.component';
import {LoginComponent} from './component/login/login.component';

export const routes: Routes = [
  {path: 'editPost/:id', component: EditPostComponent},
  {path: 'posts', component: PostsComponent},
  {path: 'concepts', component: ConceptPostsComponent},
  {path: 'addPost', component: AddPostComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];
