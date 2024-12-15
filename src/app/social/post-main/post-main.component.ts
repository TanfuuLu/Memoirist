import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Post, PostService } from '../../Service/Post.service';
import { UserProfile, UserService } from '../../Service/User.service';
import { AuthService } from '../../Service/Auth.service';
import { AddCommentPost, Comment, CommentPostService } from '../../Service/CommentPost.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { writer } from 'repl';

@Component({
  selector: 'app-post-main',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './post-main.component.html',
  styleUrl: './post-main.component.scss'
})
export class PostMainComponent implements OnInit {
  mainPostId!: number;
  mainPost!: Post;
  postUser?: UserProfile;
  user!: UserProfile;
  listComment!: Comment[];
  frmAddComment!: FormGroup;
  addComment?: AddCommentPost;
  constructor(private postService: PostService, private router: ActivatedRoute, private userService: UserService, private authService: AuthService, private commentService: CommentPostService) {
    this.frmAddComment = new FormGroup({
      commentContext: new FormControl(null, [Validators.required]),

    })
  }
  ngOnInit(): void {
    this.authService.loadCurrentUser();

    // Lấy id bài viết và id người dùng từ route
    this.mainPostId = Number(this.router.snapshot.paramMap.get('idPost'));
    const userPostId = Number(this.router.snapshot.paramMap.get('idWriter'));
    const userLoginId = Number(sessionStorage.getItem('userId'));
    // Nếu id bài viết có giá trị
    if (this.mainPostId) {
      this.commentService.getListCommentOfPost(this.mainPostId).subscribe({
        next: (result) => {
          this.listComment = result || [];  // Gán mảng rỗng nếu result là undefined
          console.log(this.listComment);
        },
        error: (err) => {
          console.log(err);
        }
      });

      this.postService.getPost(this.mainPostId).subscribe({
        next: (result) => {
          if (result) {
            this.mainPost = result;
            console.log(this.mainPost);
          }
        }
      });
    }

    // Nếu id người dùng có giá trị
    this.userService.getUserProfile(userPostId).subscribe({
      next: (result) => {
        if (result) {
          this.postUser = result;
          console.log(this.postUser);

        }
      }
    });
    this.userService.getUserProfile(userLoginId).subscribe({
      next: (result) => {
        if (result) {
          this.user = result;
          console.log(this.user);

        }
      }
    });
    // Lấy thông tin người dùng hiện tại

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
      return post!.listWriterLikePost?.includes(user.writerId) ? true : false;
    } else {
      return false;
    }
  }
  addCommentButton() {
    this.authService.currentUser$.subscribe(user => {
      this.addComment = {
        commentContext: this.frmAddComment.get('commentContext')?.value,
        commentWriterId: user.writerId,
        commentWriterAvatar: user.writerAvatar ?? null,
        commentWriterName: user.writerFullname ?? null,
        postId: this.mainPost.postId
      };
      
    })
    console.log(this.addComment);
    this.commentService.addComment(this.addComment)
    .subscribe({
      next: (result) => {
        this.commentService.getListCommentOfPost(this.mainPostId).subscribe({
          next: (result) => {
            this.listComment = result || [];  // Gán mảng rỗng nếu result là undefined
            console.log(this.listComment);
          },
          error: (err) => {
            console.log(err);
          }
        });
        console.log(result);
      }
    })
  }
}

