import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfile, UserService } from '../../Service/User.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Service/Auth.service';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-user.component.html',
  styleUrl: './search-user.component.scss'
})
export class SearchUserComponent implements OnInit {
  frmSearch!: FormGroup;
  listUserResult!: UserProfile[];
  userProfile!: UserProfile;
  constructor(private userService: UserService, private route: ActivatedRoute, private authService: AuthService) {
    this.frmSearch = new FormGroup(
      {
        userName: new FormControl(null, [Validators.required])
      }
    )
  }
  ngOnInit(): void {
    this.authService.checkLogin();

    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.userService.getUserProfile(Number(userId))
        .subscribe({
          next: (profile) => {
            this.userProfile = profile;
            console.log(this.userProfile);
          }
        })
    }
  }
  searchUser() {
    const value = this.frmSearch.get('userName')?.value;
    this.userService.searchUser(value)
      .subscribe({
        next: (result) => {
          console.log(value);
          this.listUserResult = result;
          console.log(this.listUserResult);
        }
      })
  }
  followUserFunction(userId: number): void {
    const userID = Number(userId);
    const userLoginId = Number(sessionStorage.getItem('userId'));
    this.userService.followUser(userLoginId, userID)
      .subscribe({
        next: (profile) => {
          console.log(profile);
          // Cập nhật lại danh sách userProfile.listFollowing sau khi follow
          if (!this.userProfile.listFollowing) {
            this.userProfile.listFollowing = [];
          }

          // Thêm userId vào danh sách người đang theo dõi
          if (!this.userProfile.listFollowing.includes(userId)) {
            this.userProfile.listFollowing.push(userId);
          }else{
            const index =this.userProfile.listFollowing.indexOf(userId);
            this.userProfile.listFollowing.splice(index,1);
          }

          // Cập nhật lại trạng thái follow trong listUserResult
          const userToUpdate = this.listUserResult.find((user) => user.writerId === userId);
        }
      })
  }
  checkFollowing(userId: number): boolean {
    if (this.userProfile.listFollowing?.includes(userId)) {
      return true;
    } else {
      return false;
    }
  }

}
