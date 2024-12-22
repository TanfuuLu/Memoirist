import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostComponent } from "./post/post.component";
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { FollowingStoryComponent } from './following-story/following-story.component';
import { StoryComponent } from './story/story.component';
import {  UpdateUserProfile, UserProfile, UserService } from '../../Service/User.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../Service/Auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule,
    PostComponent, FollowingStoryComponent, StoryComponent, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  selectedOption?: string = "post";
  userProfile: UserProfile = {
    writerId: 0,
    writerUsername: '',
    writerAvatar: '',
    account: '',
    password: '',
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
  writerImg!: string;
  imagePreviews: string = '';
  countFollower?: number; 
  countFollowing?: number;
  userId!: string | null;
  updateProfileForm!: FormGroup;
  isModalOpen: boolean = false;
  updateUserProfile:  UpdateUserProfile = {
    writerAvatar: '',
    writerBio: '',
    writerFullname: '',
    writerUsername: '',
  };
  private readonly platformId = inject(PLATFORM_ID);
  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthService, private fb: FormBuilder) {
    this.updateProfileForm = this.fb.group({
      writerFullname: ['', [Validators.required, Validators.minLength(3)]],
      writerUsername: ['', [Validators.required, Validators.minLength(3)]],
      writerAvatar: [this.userProfile.writerAvatar], // Avatar sẽ là file input
      writerBio: ['', [Validators.maxLength(500)]],
    });
  }
  openModal(): void {
    this.isModalOpen = true;
    // Cập nhật giá trị vào form khi mở modal
    this.updateProfileForm.patchValue({
      writerFullname: this.userProfile.writerFullname,
      writerUsername: this.userProfile.writerUsername,
      // writerAvatar: this.userProfile.writerAvatar,
      writerBio: this.userProfile.writerBio,
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  onSubmit(): void {
    if (this.updateProfileForm.valid) {
      this.updateUserProfile.writerFullname = this.updateProfileForm.get('writerFullname')?.value;
      this.updateUserProfile.writerUsername = this.updateProfileForm.get('writerUsername')?.value;
      this.updateUserProfile.writerAvatar = this.writerImg;
      this.updateUserProfile.writerBio = this.updateProfileForm.get('writerBio')?.value;
      this.userService.updateProfile(Number(this.userId), this.updateUserProfile)
      .subscribe({
        next: (result) =>{
          console.log(result);
          // this.userProfile = result;
          this.closeModal();
        }
    })
    } else {
      console.log('Form không hợp lệ!');
    }
  }
  ngOnInit(): void {
    this.authService.checkLogin();
    if (isPlatformBrowser(this.platformId)) {
      this.userId = sessionStorage.getItem("userId");
    }

    if (this.userId) {
      this.userService.getUserProfile(Number(this.userId))
        .subscribe({
          next: (profile) => {
            this.userProfile = profile;
            console.log(this.userProfile);
            this.calCountFollower();
            this.calCountFollowing();
          }
        })
    }
  }
  calCountFollower(): void {
    this.countFollower = this.userProfile.listFollower?.length
  }
  calCountFollowing(): void {
    this.countFollowing = this.userProfile.listFollowing?.length
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0]; // Lấy file đầu tiên người dùng chọn
  
      // Tạo URL Base64 để hiển thị ảnh preview
      const reader = new FileReader();
  
      reader.onload = () => {
        if (reader.result) {
          this.imagePreviews = reader.result.toString(); // Cập nhật URL preview
        }
      };
  
      reader.onerror = (err) => {
        console.error('Error reading file:', err);
      };
  
      reader.readAsDataURL(file); 
      // Gửi ảnh lên server
      this.userService.uploadImages(file).subscribe({
        next: (fileName) => {
          console.log('File uploaded successfully:', fileName);
          // Cập nhật postImage với đường dẫn từ server (giả sử server trả về tên file hoặc URL)
          this.writerImg = fileName; // Lưu tên file hoặc URL trả về từ server
          console.log(this.writerImg);
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
    } else {
      console.log('No files selected');
    }
  }
  

}
