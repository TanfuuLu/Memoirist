import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostComponent } from "./post/post.component";
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { FollowingStoryComponent } from './following-story/following-story.component';
import { StoryComponent } from './story/story.component';
import { UserProfile, UserService } from '../../Service/User.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,
     PostComponent,FollowingStoryComponent, StoryComponent, RouterLink, RouterLinkActive],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  selectedOption?: string ="post";
  userProfile: UserProfile= {
    writerId:0,
    writerUsername:'',
    writerAvatar: '',
    account: '',
    password:'',
    writerBio: '',
    writerBirthday: '',
    writerFullname: '',
    writerGender: '',
    writerPhone: '',
    listFollower: [],
    listFollowing: [],
    listFollowingStoryId: [],
    listLikesPost: [],
    listPostCommented: [],
    listPostId: [],
    listStoryCommented: [],
    listStoryId: []
  };
  countFollower?: number;
  countFollowing?: number;
  constructor(private route: ActivatedRoute, private userService: UserService){
  }
  ngOnInit(): void {
    const userId = sessionStorage.getItem("userId");
    
    if(userId){
      this.userService.getUserProfile(Number(userId))
      .subscribe({
        next:(profile) =>{
          this.userProfile = profile;
          console.log(this.userProfile);
          this.calCountFollower();
          this.calCountFollowing();
        }
      })
    }
    
  }
  calCountFollower():void{
    this.countFollower = this.userProfile.listFollower?.length
  }
  calCountFollowing():void{
    this.countFollowing = this.userProfile.listFollowing?.length
  }
  
}
