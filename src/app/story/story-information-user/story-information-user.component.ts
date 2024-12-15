import { Component } from '@angular/core';
import { Story, StoryService } from '../../Service/Story.service';
import { Chapter, ChapterService } from '../../Service/Chapter.service';
import { CommentStoryService } from '../../Service/CommentStory.service';
import { AuthService } from '../../Service/Auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-story-information-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './story-information-user.component.html',
  styleUrl: './story-information-user.component.scss'
})
export class StoryInformationUserComponent {
 storyInfo?: Story;
   listChapterStory?: Chapter[];
   constructor(private storyService: StoryService, private router: ActivatedRoute, private chapterService: ChapterService, private commentService: CommentStoryService, private authService: AuthService) {
   
   }
   ngOnInit(): void {
     this.authService.checkLogin();
 
     //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
     //Add 'implements OnInit' to the class.
     const storyId = Number(this.router.snapshot.paramMap.get('storyId'));
     this.chapterService.getListChapterOfStory(storyId)
       .subscribe({
         next: (chapter) => {
           this.listChapterStory = chapter;
         }
       })
     this.storyService.getStoryById(storyId)
       .subscribe({
         next: (story) => {
           this.storyInfo = story;
           console.log(this.storyInfo);
         }
       })
       this.commentService.getListStoryComment(storyId)
       .subscribe({
         next: (result) => {
           console.log(result);
         }
       })
   }
}
