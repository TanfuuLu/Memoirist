import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AddPost, Post, PostService } from '../../../Service/Post.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Service/Auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, ReactiveFormsModule, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  @Input() userProfile: any;
  isModalOpen = false;
  listPost!: Post[];
  post: AddPost = {
    postPictureUrl: []
  };
  currentDate = new Date();
  formattedDate = this.currentDate.toLocaleDateString('vi-VN');
  postImage!: string[];
  postForm!: FormGroup;
  base64Images: string[] = [];
  imagePreviews: string[] = [];
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
  constructor(private postService: PostService, private authService: AuthService, private http: HttpClient,
    private router: ActivatedRoute, private cdr: ChangeDetectorRef, private route: Router) {
    this.postForm = new FormGroup({
      postContext: new FormControl(null, [Validators.required])
    })
    this.editForm = new FormGroup({
      postContext: new FormControl(null, [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.authService.checkLogin();

    const userId = this.router.snapshot.paramMap.get('id');
    if (userId) {
      this.postService.getListByWriterId(Number(userId))
        .subscribe({
          next: (post) => {
            this.listPost = post;
          }
        })
    }
  }
  calcuCommentedPost(listIdCommented?: number[] | null): number | undefined {
    return listIdCommented?.length;
  }
  isPostContextValid(): boolean {
    return !!this.postForm.get('postContext')?.value && this.postForm.get('postContext')?.value.trim().length > 0;
  }
  removeImage(imgSrc: string): void {
    // Xóa ảnh khỏi mảng imagePreviews
    this.imagePreviews = this.imagePreviews.filter(image => image !== imgSrc);
    console.log('Updated imagePreviews after removal:', this.imagePreviews);
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
            console.log('Base64 Data:', reader.result); // Log kiểm tra Base64
            previews.push(reader.result.toString()); // Thêm preview vào mảng tạm
            this.imagePreviews = [...this.imagePreviews, ...previews]; // Cập nhật vào mảng chính
            console.log('Updated imagePreviews:', this.imagePreviews); // Log kiểm tra mảng
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
          this.postImage = [...(this.postImage || []), ...paths];
          console.log('Updated postImage:', this.postImage);
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
    } else {
      console.log('No files selected');
    }
  }
  submitForm() {
    this.ngOnInit();
    this.post = this.postForm.value;
    this.authService.currentUser$.subscribe(user => {
      this.post.postWriterId = this.userProfile.writerId;
      this.post.postWriterAvatar = this.userProfile.writerAvatar;
      this.post.postWriterName = this.userProfile.writerUsername;
      this.post.postPictureUrl = this.postImage;
    })
    this.postService.addPost(this.post)
      .subscribe({
        next: (post) => {
          console.log(post);
          console.log(post.postContext);
          window.location.reload();
          // this.route.navigateByUrl(`/Refresh`, { skipLocationChange: true }).then(() => {
          //   this.route.navigate([this.router.url]);
          // });
        }
      })

  }
  toggleLike(post: Post) {
    const writerId = this.userProfile.writerId;

    this.postService.likePost(writerId, post.postId).subscribe({
      next: (result) => {
        post.listWriterLikePost = result.listWriterLikePost;
        this.postService.getListPost().subscribe({
          next: (result) => {

          }
        })
      },
      error: (err) => {
        console.error('Lỗi khi like bài viết:', err);
      },
    });
  }
  onDelete(postId: number): void {
    const userId = this.router.snapshot.paramMap.get('id');
    if (confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
      this.postService.deletePost(postId)
        .subscribe({
          next: (result) => {
            console.log(result);
            this.postService.getListByWriterId(Number(userId))
              .subscribe({
                next: (post) => {
                  this.listPost = post;
                }
              })
          }
        })
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
  formatContent(content?: string): string | undefined {
    return content?.split('\n').join('<br>') // Thay mỗi '\n' bằng '<br>'
  }
  // Hàm Edit
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
          const index = this.listPost?.findIndex(post => post.postId === updatedPost.postId);
          if (index !== undefined && index !== -1) {
            this.listPost![index] = updatedPost;
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
