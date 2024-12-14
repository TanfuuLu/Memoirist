import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Story, StoryService } from '../../Service/Story.service';
import {  Chapter, ChapterService } from '../../Service/Chapter.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-story-information',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './story-information.component.html',
  styleUrl: './story-information.component.scss'
})
export class StoryInformationComponent {
  storyInfo?: Story;
  listChapterStory?: Chapter[];
  constructor(private storyService: StoryService, private router: ActivatedRoute, private chapterService: ChapterService){
    const storyId = Number(this.router.snapshot.paramMap.get('storyId'));
    this.storyService.getStoryById(storyId)
    .subscribe({
      next: (story) => {
        this.storyInfo = story;
       console.log(this.storyInfo);
      }
    })
    this.chapterService.getListChapterOfStory(storyId)
    .subscribe({
      next:(chapter) => {
        this.listChapterStory = chapter;
      }
    })
  }
  deleteChapter(chapterId: number){
    const storyId = Number(this.router.snapshot.paramMap.get('storyId'));

    this.chapterService.deleteChapter(chapterId)
    .subscribe({
      next: (result) => {
        console.log(result);
    this.chapterService.getListChapterOfStory(storyId)
    .subscribe({
      next:(chapter) => {
        this.listChapterStory = chapter;
        console.log(this.listChapterStory);
      }
    })
      }
    })
  }
}
