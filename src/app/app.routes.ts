import { Routes } from '@angular/router';
import path from 'path';
import { SignInComponent } from './sign-in/sign-in.component';
import { LoginComponent } from './login/login.component';
import { NewfeedsUserComponent } from './newfeeds-user/newfeeds-user.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
   {
    path: 'sign-in', component: SignInComponent
   },
   {
    path: 'login', component: LoginComponent
   },
   {
    path: 'newfeeds', component:NewfeedsUserComponent
   },
   {
      path:'',component:ProfileComponent
   }
    
];
