import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Chapter, ChapterService } from '../../Service/Chapter.service';
import e from 'express';
import { Story, StoryService } from '../../Service/Story.service';
import { AuthService } from '../../Service/Auth.service';

@Component({
  selector: 'app-read-chapter',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkActive, RouterLink],
  templateUrl: './read-chapter.component.html',
  styleUrl: './read-chapter.component.scss'
})
export class ReadChapterComponent {
  getChapter?: Chapter;
  listChapterStory!: Chapter[];
  storyId!: Number;
  formatContent(content?: string): string | undefined {
    return content?.split('\n').join('<br>') // Thay mỗi '\n' bằng '<br>'
  }
  constructor(private authService: AuthService,private chapterService: ChapterService, private router: ActivatedRoute, private route: Router, private storyService: StoryService) {
    this.authService.checkLogin();

    this.storyId = Number(this.router.snapshot.paramMap.get('storyId'))
    const chapterId = Number(this.router.snapshot.paramMap.get('chapterId'));
    this.chapterService.getChapter(chapterId, this.storyId)
      .subscribe({
        next: (chapter) => {
          this.getChapter = chapter;
          console.log(this.getChapter);
        }
      })
  }
  
  nextChapter() {

    const storyId = Number(this.router.snapshot.paramMap.get('storyId'))
    const chapterId = Number(this.router.snapshot.paramMap.get('chapterId'));
    this.chapterService.getListChapterOfStory(storyId)
      .subscribe({
        next: (chapter) => {
          this.listChapterStory = chapter;
          for (let i = 0; i < this.listChapterStory.length; i++) {
            if (this.listChapterStory[i].chapterId == chapterId) {
              if (this.listChapterStory[i + 1] != null) {
                this.getChapter = this.listChapterStory[i + 1];
              } else {
                this.getChapter = this.listChapterStory[i];
              }
            }
            this.route.navigateByUrl(`/Refresh`, { skipLocationChange: true }).then(() => {
              this.route.navigate([`/story/${storyId}/chapter/${this.getChapter?.chapterId}`]);
            });
          }
        }
      })
  }
  previousChapter(){
    const storyId = Number(this.router.snapshot.paramMap.get('storyId'))
    const chapterId = Number(this.router.snapshot.paramMap.get('chapterId')) ;
    this.chapterService.getListChapterOfStory(storyId)
      .subscribe({
        next: (chapter) => {
          this.listChapterStory = chapter;
          for (let i = 0; i < this.listChapterStory.length; i++) {
            if (this.listChapterStory[i].chapterId == chapterId) {
              if (this.listChapterStory[i -1 ] != null) {
                this.getChapter = this.listChapterStory[i - 1];
              } else {
                this.getChapter = this.listChapterStory[i];
              }
            }
            this.route.navigateByUrl(`/Refresh`, { skipLocationChange: true }).then(() => {
              this.route.navigate([`/story/${storyId}/chapter/${this.getChapter?.chapterId}`]);
            });
          }
        }
      })
  }
  mainStory(){
    this.route.navigateByUrl(`/Refresh`, { skipLocationChange: true }).then(() => {
      this.route.navigate([`/story/${this.storyId}/story-info`]);
    });
  }
}
