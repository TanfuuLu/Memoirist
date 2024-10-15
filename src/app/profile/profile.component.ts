import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NewfeedsUserComponent } from '../newfeeds-user/newfeeds-user.component';
import { FormsModule } from '@angular/forms';
import { PostComponent } from "./post/post.component";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FollowingStoryComponent } from './following-story/following-story.component';
import { StoryComponent } from './story/story.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent, NewfeedsUserComponent, FormsModule,
     PostComponent,FollowingStoryComponent, StoryComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  selectedOption?: string ="post";
  
}
