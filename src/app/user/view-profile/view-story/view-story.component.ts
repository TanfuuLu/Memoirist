import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../Service/Auth.service';
import { Story, StoryReponse, StoryService } from '../../../Service/Story.service';
import { UserProfile, UserService } from '../../../Service/User.service';
import { Chapter, ChapterService } from '../../../Service/Chapter.service';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-story',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule,CommonModule],
  templateUrl: './view-story.component.html',
  styleUrl: './view-story.component.scss'
})
export class ViewStoryComponent implements OnInit{
  @Input() user!: UserProfile;
  userLogin!: UserProfile;
  listStoryWriter!: StoryReponse[];
    lastChaptersNumber: { [storyId: number]: number } = {};
    listChapter!: Chapter[];
    lastChapterIds: { [storyId: number]: number } = {};
    isModalOpen = false;
    selectedStoryId!: number;
  
    reportForm: FormGroup;
    reportReasons = ['Nội dung không phù hợp', 'Xuyên tạc/liên quan chính trị', 'Đạo sản phẩm', 'Tác phẩm 18+'];
  
  constructor(private fb: FormBuilder,private authService: AuthService, private storyService: StoryService, private chapterService: ChapterService, private userService: UserService){
    this.reportForm = this.fb.group({
      violation: ['', Validators.required],
    });
  }
  ngOnInit(): void { 
    this.authService.checkLogin();
    this.authService.loadCurrentUser();
    this.authService.currentUser$.subscribe({
      next: (result) => {
        if (result) { // Chỉ xử lý khi có dữ liệu
          this.userLogin = result;
          console.log(this.userLogin);
    
          if (this.userLogin.listFollowingStoryId) {
            console.log(this.userLogin.listFollowingStoryId);
          } else {
            console.error('listFollowingStoryId không tồn tại hoặc đang là null.');
          }
        } 
      }
    }) 
    this.storyService.getListStoryWriter(this.user.writerId)
    .subscribe({
      next: (result) => {
        if(result){
          this.listStoryWriter = result;
          this.loadLastChapters();
          this.loadLastChapterIds()
        }
        
      }
    })
  }
  loadLastChapters(): void {
    this.listStoryWriter.forEach((story) => {
      this.chapterService.getLastChapter(story.storyId).subscribe({
        next: (chapter) => {
          this.lastChaptersNumber[story.storyId!] = chapter; // Lưu chương cuối vào đối tượng

        },
        error: (err) => {
          console.error(`Lỗi khi tải chương cuối cho truyện ID ${story.storyId}:`, err);
        },
      });

    });

  }
  loadLastChapterIds(): void {
    this.listStoryWriter.forEach((story) => {
      this.chapterService.getLastChapterId(story.storyId).subscribe({
        next: (chapterId) => {
          this.lastChapterIds[story.storyId!] = chapterId;
        },
        error: (err) => {
          console.error(`Lỗi khi tải Last Chapter ID cho truyện ID ${story.storyId}:`, err);
        },
      });
    });
  }
  getLastChapterNumber(storyId?: number | null): number {
    return this.lastChaptersNumber[storyId!] ?? 0; // Nếu undefined, trả về 0 (hoặc giá trị mặc định khác)
  }
  getLastChapterId(storyId: number): number | null {
    return this.lastChapterIds[storyId] ?? null;
  }
  userFollowStory(storyId: number) {
    const userLoginId = Number(sessionStorage.getItem('userId'));
    this.userService.followStory(userLoginId, storyId)
    .subscribe({
      next: (result) => {
        console.log(result);
         // Cập nhật danh sách following
      if (!this.userLogin.listFollowingStoryId) {
        this.userLogin.listFollowingStoryId = [];
      }

      if (!this.userLogin.listFollowingStoryId.includes(storyId)) {
        this.userLogin.listFollowingStoryId.push(storyId); // Thêm nếu chưa có
      } else {
        // Nếu muốn toggle Follow/Unfollow, xóa storyId nếu đã có
        this.userLogin.listFollowingStoryId = this.userLogin.listFollowingStoryId.filter(
          (id) => id !== storyId
        );
      }
      }
    })
  }
  checkFollowingStory(storyId: number): boolean{
    const userLoginId = Number(sessionStorage.getItem('userId'));
    if (!this.userLogin || !this.userLogin.listFollowingStoryId) {
      return false; // Mặc định trả về false nếu chưa có dữ liệu
    }
    return this.userLogin.listFollowingStoryId.includes(storyId);
  }
  openReportModal(storyId: number) {
    this.selectedStoryId = storyId;
    this.isModalOpen = true;
  }

  closeReportModal() {
    this.isModalOpen = false;
  }

  submitReport() {
    if (this.reportForm.valid) {
      const data = {
        storyReportId: this.selectedStoryId,
        violation: this.reportForm.value.violation,
        dateTimeReport: new Date().toISOString(),
      };

      this.storyService.reportStory(data).subscribe({
        next: () => {
          alert('Báo cáo thành công');
          this.closeReportModal();
        },
        error: () => alert('Đã xảy ra lỗi. Vui lòng thử lại.'),
      });
    }
  }

 
}
