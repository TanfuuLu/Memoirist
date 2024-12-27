import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AppComponent } from "../../app.component";
import { CommonModule, NgClass } from '@angular/common';
import { AddPost, Post, PostService } from '../../Service/Post.service';
import { UserProfile, UserService } from '../../Service/User.service';
import { AuthService } from '../../Service/Auth.service';
import { HttpClient } from '@angular/common/http';
import { response } from 'express';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-newfeeds-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, CommonModule, ReactiveFormsModule],
  templateUrl: './newfeeds-user.component.html',
  styleUrl: './newfeeds-user.component.scss'
})
export class NewfeedsUserComponent implements OnInit {
  user!: UserProfile;
  base64Images: string[] = [];
  post: AddPost = {
    postPictureUrl: []
  };
  postImage!: string[];
  postForm!: FormGroup;
  isModalOpen = false;
  listPostNewfeeds?: Post[];
  currentDate = new Date();
  formattedDate = this.currentDate.toLocaleDateString('vi-VN');
  imagePreviews: string[] = [];
  selectedPostId: number | null = null;
  userRole!: string | null;
  dropdownStates: Map<number, boolean> = new Map();
  editForm!: FormGroup 
  isEditing = false;
  editedPost!: Post | null;
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  closeModalClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('fixed')) {
      this.closeModal();
    }
  }
  constructor(private postService: PostService, private authService: AuthService, private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {
    this.postForm = new FormGroup({
      postContext: new FormControl(null, [Validators.required])
    })
    if (!sessionStorage.getItem('userId') || !sessionStorage.getItem('authToken')){
      this.authService.loadCurrentUser();
    }
    this.editForm = new FormGroup({
      postContext: new FormControl(null, [Validators.required]),
    });
    
  }
  checkUserId(writerId?: number | null): boolean {
    if (writerId == Number(sessionStorage.getItem('userId'))) {
      return true;
    } else {
      return false;
    }

  }
  submitForm() {
    this.post = this.postForm.value;
    this.authService.currentUser$.subscribe(user => {
      this.post.postWriterId = user.writerId;
      this.post.postWriterAvatar = user.writerAvatar;
      this.post.postWriterName = user.writerUsername;
      this.post.postPictureUrl = this.postImage;
    })
    this.postService.addPost(this.post)
      .subscribe({
        next: (post) => {
          console.log(post);
          console.log(post.postContext);
          // window.location.reload();
          this.router.navigateByUrl(`/Refresh`, { skipLocationChange: true }).then(() => {
            this.router.navigate([this.router.url]);
            window.location.reload();
          });
        }
      })

  }
  formatContent(content?: string): string | undefined {
    return content?.split('\n').join('<br>') // Thay mỗi '\n' bằng '<br>'
  }
  ngOnInit(): void {
    this.authService.checkLogin();
    this.authService.loadCurrentUser();
    this.postService.getListPost()
      .subscribe({
        next: ((post) => {
          this.listPostNewfeeds = post;
          console.log(this.listPostNewfeeds);
        })
      })
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    })
    this.userRole = this.authService.getRoleFromToken();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const files: File[] = Array.from(input.files);

      const previews: string[] = []; // Khởi tạo mảng để lưu preview

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (reader.result) {
            previews.push(reader.result.toString()); // Thêm preview vào mảng tạm
            this.imagePreviews = [...this.imagePreviews, ...previews]; // Cập nhật vào mảng chính
          }
        };

        reader.onerror = (err) => {
          console.error('Error reading file:', err);
        };

        reader.readAsDataURL(file); // Chuyển file sang Base64
      });

      // Gửi ảnh lên server
      this.postService.uploadImages(files).subscribe({
        next: (fileNames) => {
          console.log('File names from API:', fileNames); // Log dữ liệu
          // Cập nhật postImage với đường dẫn từ server
          const paths = fileNames.map((name) => `${name}`);
          this.postImage = [...(this.postImage || []), ...paths];        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
    } else {
      console.log('No files selected');
    }
  }
  isPostContextValid(): boolean {
    return !!this.postForm.get('postContext')?.value && this.postForm.get('postContext')?.value.trim().length > 0;
  }
  removeImage(imgSrc: string): void {
    // Xóa ảnh khỏi mảng imagePreviews
    this.imagePreviews = this.imagePreviews.filter(image => image !== imgSrc);
    console.log('Updated imagePreviews after removal:', this.imagePreviews);
  }
  toggleLike(post: Post) {
    const writerId = this.user.writerId;
    this.postService.likePost(writerId, post.postId).subscribe({
      next: (result) => {
        post.listWriterLikePost = result.listWriterLikePost;
      },
      error: (err) => {
        console.error('Lỗi khi like bài viết:', err);
      },
    });
  }
  checkedLikePost(user: UserProfile, post: Post): boolean {
    if (user?.writerId!) {
      return post.listWriterLikePost?.includes(user.writerId) ? true : false;
    } else {
      return false;
    }

  }


  toggleDropdown(postId: number): void {
    const currentState = this.dropdownStates.get(postId) || false;
    this.dropdownStates.set(postId, !currentState);
  }


  // Kiểm tra dropdown có mở không
  isDropdownOpen(postId: number): boolean {
    return this.dropdownStates.get(postId) || false;
  }


  // Hàm Delete
  onDelete(postId: number): void {
   this.postService.deletePost(postId)
   .subscribe({
    next: (result) => {
      console.log(result);
      this.postService.getListPost()
      .subscribe({
        next: ((post) => {
          this.listPostNewfeeds = post;
        })
      })
    }
   })
  }
  onEdit(post: Post) {
    this.isEditing = true;
    this.editedPost = post;
    this.editForm.patchValue({
      postContext: post.postContext,
    });
  }
  editContextPost(newContext: string) {
    if (this.editedPost) {
      this.editedPost.postContext = newContext; // Gán nội dung mới cho bài viết đang chỉnh sửa
      this.postService.editContextPost(this.editedPost.postId, newContext).subscribe({
        next: (updatedPost) => {
          console.log('Cập nhật bài viết thành công:', updatedPost);
          // Đồng bộ danh sách bài viết
          const index = this.listPostNewfeeds?.findIndex(post => post.postId === updatedPost.postId);
          if (index !== undefined && index !== -1) {
            this.listPostNewfeeds![index] = updatedPost;
          }
          this.cancelEdit(); // Đóng modal chỉnh sửa
        },
        error: (err) => {
          console.error('Lỗi khi chỉnh sửa bài viết:', err);
          alert('Không thể cập nhật bài viết, vui lòng thử lại.');
        }
      });
    }
  }

  saveEdit() {
    if (this.editForm.valid && this.editedPost) {
      const newContext = this.editForm.get('postContext')?.value;
      this.editContextPost(newContext);
    } else {
      alert('Vui lòng nhập nội dung hợp lệ.');
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedPost = null;
  }
}
