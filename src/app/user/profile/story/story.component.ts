import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StoryReponse, StoryService } from '../../../Service/Story.service';
import { AuthService } from '../../../Service/Auth.service';
import { UserProfile } from '../../../Service/User.service';
import { Chapter, ChapterService } from '../../../Service/Chapter.service';
import { last } from 'rxjs';
import { writer } from 'repl';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent {
  @Input() userProfile?: UserProfile;
  listStoryUser!: StoryReponse[];
  lastChaptersNumber: { [storyId: number]: number } = {};
  listChapter!: Chapter[];
  lastChapterIds: { [storyId: number]: number } = {};
  constructor(private storyService: StoryService, private authService: AuthService, private chapterService: ChapterService) {
    const writerId = Number(sessionStorage.getItem('userId'));
    this.storyService.getListStoryWriter(writerId)
      .subscribe({
        next: (story) => {
          this.listStoryUser = story;
          this.loadLastChapters();
          this.loadLastChapterIds()
        }
      })
  }
  loadLastChapters(): void {
    this.listStoryUser.forEach((story) => {
      this.chapterService.getLastChapter(story.storyId).subscribe({
        next: (chapter) => {
          this.lastChaptersNumber[story.storyId!] = chapter; // Lưu chương cuối vào đối tượng

        },
        error: (err) => {
          console.error(`Lỗi khi tải chương cuối cho truyện ID ${story.storyId}:`, err);
        },
      });

    });

  }
  loadLastChapterIds(): void {
    this.listStoryUser.forEach((story) => {
      this.chapterService.getLastChapterId(story.storyId).subscribe({
        next: (chapterId) => {
          this.lastChapterIds[story.storyId!] = chapterId;
        },
        error: (err) => {
          console.error(`Lỗi khi tải Last Chapter ID cho truyện ID ${story.storyId}:`, err);
        },
      });
    });
  }
  getLastChapterNumber(storyId?: number | null): number {
    return this.lastChaptersNumber[storyId!] ?? 0; // Nếu undefined, trả về 0 (hoặc giá trị mặc định khác)
  }
  getLastChapterId(storyId: number): number | null {
    return this.lastChapterIds[storyId] ?? null;
  }
  deleteStoryButton(storyId: number){
    const writerId = Number(sessionStorage.getItem('userId'));

    this.storyService.deleteStory(storyId)
    .subscribe({
      next: (result) => {
        console.log(result);
        this.storyService.getListStoryWriter(writerId)
        .subscribe({
          next: (story) => {
            this.listStoryUser = story;
            console.log(this.listStoryUser);
            this.loadLastChapters();
            this.loadLastChapterIds()
          }
        })
      }
    })
  
  
  }
}
