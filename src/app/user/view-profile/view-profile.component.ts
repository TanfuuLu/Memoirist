import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from 'express';
import { ViewPostComponent } from './view-post/view-post.component';
import { ViewStoryComponent } from './view-story/view-story.component';
import { UserProfile, UserService } from '../../Service/User.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [FormsModule, ViewPostComponent,ViewStoryComponent, CommonModule],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent {
  userProfile!: UserProfile;
  countFollower?: number;
  selectedOption?: string ="view-post";
  constructor(private route: ActivatedRoute, private userService: UserService){
  }
  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if(userId){
      this.userService.getUserProfile(Number(userId))
      .subscribe({
        next:(profile) =>{
          this.userProfile = profile;
          console.log(this.userProfile);
          this.calCountFollower();
        }
      })
    }
  }
  followUserFunction(): void{
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    const userLoginId = Number(sessionStorage.getItem('userId'));
   this.userService.followUser(userLoginId,userId)
   .subscribe({
    next:(profile) => {
      this.userProfile = profile;
      this.calCountFollower();
    }
   })
  }
  calCountFollower():void{
    this.countFollower = this.userProfile.listFollower?.length
  }
}
