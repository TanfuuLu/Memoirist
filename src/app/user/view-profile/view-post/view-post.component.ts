import { Component, Input, OnInit } from '@angular/core';
import { Post, PostService } from '../../../Service/Post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-post',
  standalone: true,
  imports: [],
  templateUrl: './view-post.component.html',
  styleUrl: './view-post.component.scss'
})
export class ViewPostComponent implements OnInit {
  @Input() userProfile: any;
  listPost!: Post[];
  userLoginId!: number;
  constructor(private router: ActivatedRoute, private postService: PostService){

  }
  ngOnInit(): void {
    const userId = this.router.snapshot.paramMap.get('id');
    if(userId){
      this.postService.getListByWriterId(Number(userId))
      .subscribe({
        next: (post) => {
          this.listPost = post;
        }
      })
    }
  }
  toggleLike(post: Post){
   
    this.userLoginId = Number(sessionStorage.getItem('userId'));

    this.postService.likePost(this.userLoginId , post.postId).subscribe({
      next: (result) => {
        post.listWriterLikePost = result.listWriterLikePost;
      },
      error: (err) => {
        console.error('Lỗi khi like bài viết:', err);
      },
    });
  }

}
