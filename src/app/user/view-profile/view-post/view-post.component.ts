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

}
