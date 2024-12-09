import { Routes } from '@angular/router';
import path from 'path';
import { SignInComponent } from './authenticate/sign-in/sign-in.component';
import { NewfeedsUserComponent } from './social/newfeeds-user/newfeeds-user.component';
import { ProfileComponent } from './user/profile/profile.component';
import { PostMainComponent } from './social/post-main/post-main.component';
import { AddStoryComponent } from './story/add-story/add-story.component';
import { StoryInformationComponent } from './story/story-information/story-information.component';
import { LoginComponent } from './authenticate/login/login.component';
import { ViewProfileComponent } from './user/view-profile/view-profile.component';
import { AddChapterComponent } from './story/add-chapter/add-chapter.component';
import { Component } from '@angular/core';
import { UserReplyComponent } from './social/user-reply/user-reply.component';
import { RefreshComponentComponent } from './refresh-component/refresh-component.component';
import { ReadChapterComponent } from './story/read-chapter/read-chapter.component';
import { ForgetPasswordComponent } from './authenticate/forget-password/forget-password.component';
import { VerifyscreenComponent } from './authenticate/verifyscreen/verifyscreen.component';

export const routes: Routes = [
   {
      path: 'sign-in', component: SignInComponent
   },
   {
      path: '', redirectTo:"/login", pathMatch:'full'
   },
   {
      path: 'login', component: LoginComponent
   },
   {
      path: 'forget-password', component:ForgetPasswordComponent
   },
   {
      path: 'newfeeds', component: NewfeedsUserComponent
   },
   {
      path: 'profile/:id', component: ProfileComponent,
   },
   {
      path: 'post', component: PostMainComponent,
   },
   {
      path: 'post/user-reply',
      component: UserReplyComponent
   },
   {
      path: 'verify-email', component: VerifyscreenComponent
   },
   {
      path: 'writer/:id/add-story', component: AddStoryComponent,

   },
   {
      path: 'story/:storyId/story-info', component: StoryInformationComponent
   },
   {
      path: 'view-profile/:id', component: ViewProfileComponent,

   },
   {
      path: 'story/:storyId/add-chapter', component: AddChapterComponent
   },
   {
      path: 'Refresh', component: RefreshComponentComponent
   },
   {
      path: 'story/:storyId/chapter/:chapterId', component:ReadChapterComponent
   }
];
