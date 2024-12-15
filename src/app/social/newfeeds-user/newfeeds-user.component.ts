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
      this.post.postWriterName = user.writerFullname;
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
    this.authService.loadCurrentUser();
    this.postService.getListPost()
      .subscribe({
        next: ((post) => {
          this.listPostNewfeeds = post;
        })
      })
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    })
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
}
