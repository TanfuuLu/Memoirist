import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../../Service/User.service';
import { Story, StoryService } from '../../../Service/Story.service';
import { ChapterService } from '../../../Service/Chapter.service';

@Component({
  selector: 'app-following-story',
  standalone: true,
  imports: [],
  templateUrl: './following-story.component.html',
  styleUrl: './following-story.component.scss'
})
export class FollowingStoryComponent implements OnInit {
  @Input() userProfile?: UserProfile;
  listStoryFollowing!: Story[];
  constructor(private storyService: StoryService, private chapterService: ChapterService){
   
  }
  ngOnInit(): void {
    console.log(this.userProfile);
   
      // this.listStoryFollowingByWriter(this.userProfile?.listFollowingStoryId!);
      console.log(this.userProfile?.listFollowingStoryId!);

  }
  listStoryFollowingByWriter(listFollowStoryId: number[]){
    this.storyService.getListFollowingByWriter(listFollowStoryId)
    .subscribe({
      next: (result) => {
        console.log(result);
      }
    })
  }

}
