import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Story, StoryReponse, StoryService } from '../../Service/Story.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Service/Auth.service';
import { UserProfile, UserService } from '../../Service/User.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit {
  frmSearch!: FormGroup;
  listStoryResult!: Story[];
  userProfile!: UserProfile;
  listStoryUser: StoryReponse[] = []; // Mảng rỗng mặc định
  listStoryIdUser: number[] = [];
  constructor(private storyService: StoryService, private authService: AuthService, private userService: UserService) {
    this.frmSearch = new FormGroup(
      {
        storyName: new FormControl(null, [Validators.required])
      }
    )
    this.authService.checkLogin();

  }
  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.userService.getUserProfile(Number(userId))
        .subscribe({
          next: (profile) => {
            this.userProfile = profile;
            console.log(this.userProfile);
          }
        })
      this.storyService.getListStoryWriter(Number(userId))
        .subscribe({
          next: (result) => {
            this.listStoryUser = result;
          }
        })
    }

  }
  searchStory() {
    const value = this.frmSearch.get('storyName')?.value;
    this.storyService.searchStory(value)
      .subscribe({
        next: (result) => {

          this.listStoryResult = result;
          console.log('listStoryResult:', this.listStoryResult);

         
        }
      })
      if(this.listStoryIdUser.length == 0){
        for (let i = 0; i < this.listStoryUser.length; i++) {
          if (this.listStoryUser[i]?.storyId !== undefined) {
            this.listStoryIdUser.push(this.listStoryUser[i].storyId!);
          }
        }
        console.log('listStoryIdUser:', this.listStoryIdUser);
  
      }
     
  }
  checkUserId(writerId?: number | null): boolean {
    if (writerId == Number(sessionStorage.getItem('userId'))) {
      return true;
    } else {
      return false;
    }

  }
  userFollowStory(storyId: number) {
    const userLoginId = Number(sessionStorage.getItem('userId'));
    this.userService.followStory(userLoginId, storyId)
      .subscribe({
        next: (result) => {
          console.log(result);
          // Cập nhật danh sách following
          if (!this.userProfile.listFollowingStoryId) {
            this.userProfile.listFollowingStoryId = [];
          }

          if (!this.userProfile.listFollowingStoryId.includes(storyId)) {
            this.userProfile.listFollowingStoryId.push(storyId); // Thêm nếu chưa có
          } else {
            // Nếu muốn toggle Follow/Unfollow, xóa storyId nếu đã có
            this.userProfile.listFollowingStoryId = this.userProfile.listFollowingStoryId.filter(
              (id) => id !== storyId
            );
          }
        }
      })
  }
  checkFollowingStory(storyId: number): boolean {
    const userLoginId = Number(sessionStorage.getItem('userId'));
    if (!this.userProfile || !this.userProfile.listFollowingStoryId) {
      return false; // Mặc định trả về false nếu chưa có dữ liệu
    }
    return this.userProfile.listFollowingStoryId.includes(storyId);
  }
  checkStoryUser(storyId: number): boolean {


    if (this.listStoryIdUser?.includes(storyId)) {

      return false;
    } else {
      return true;
    }


  }


}

