import { Routes } from '@angular/router';
import path from 'path';
import { SignInComponent } from './sign-in/sign-in.component';
import { LoginComponent } from './login/login.component';
import { NewfeedsUserComponent } from './newfeeds-user/newfeeds-user.component';
import { ProfileComponent } from './profile/profile.component';
import { PostMainComponent } from './post-main/post-main.component';
import { AddStoryComponent } from './add-story/add-story.component';
import { StoryInformationComponent } from './story-information/story-information.component';

export const routes: Routes = [
   {
      path: 'sign-in', component: SignInComponent
   },
   {
      path: 'login', component: LoginComponent
   },
   {
      path: 'newfeeds', component: NewfeedsUserComponent
   },
   {
      path: 'profile', component: ProfileComponent,
   },
   {
      path: 'post', component: PostMainComponent,
   },
   {
      path:'add-story', component:AddStoryComponent,
      
   },
   {
      path:'', component:StoryInformationComponent
   }

];
