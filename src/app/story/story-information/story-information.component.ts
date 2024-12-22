import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Story, StoryService } from '../../Service/Story.service';
import { Chapter, ChapterService } from '../../Service/Chapter.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Service/Auth.service';

@Component({
  selector: 'app-story-information',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, ReactiveFormsModule],
  templateUrl: './story-information.component.html',
  styleUrl: './story-information.component.scss'
})
export class StoryInformationComponent implements OnInit {
  storyInfo?: Story;
  listChapterStory?: Chapter[];
  listComment!: Comment[];
  frmAddComment!: FormGroup;
  constructor(private storyService: StoryService, private router: ActivatedRoute, private chapterService: ChapterService, private authService: AuthService) {
    this.frmAddComment = new FormGroup({
      commentContext: new FormControl(null, [Validators.required])
    })
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

  }
  deleteChapter(chapterId: number) {
    const storyId = Number(this.router.snapshot.paramMap.get('storyId'));

    this.chapterService.deleteChapter(chapterId)
      .subscribe({
        next: (result) => {
          console.log(result);
          this.chapterService.getListChapterOfStory(storyId)
            .subscribe({
              next: (chapter) => {
                this.listChapterStory = chapter;
                console.log(this.listChapterStory);
              }
            })
        }
      })
  }
  
}
