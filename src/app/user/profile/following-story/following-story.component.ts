import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../../Service/User.service';
import { Story, StoryService } from '../../../Service/Story.service';
import { Chapter, ChapterService } from '../../../Service/Chapter.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-following-story',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './following-story.component.html',
  styleUrl: './following-story.component.scss'
})
export class FollowingStoryComponent implements OnInit {
  @Input() userProfile?: UserProfile;
  listStoryFollowing!: Story[];
    lastChaptersNumber: { [storyId: number]: number } = {};
    listChapter!: Chapter[];
    lastChapterIds: { [storyId: number]: number } = {};
  constructor(private storyService: StoryService, private chapterService: ChapterService){
   
  }
  ngOnInit(): void {
    console.log(this.userProfile);
   
      // this.listStoryFollowingByWriter(this.userProfile?.listFollowingStoryId!);
      console.log(this.userProfile?.listFollowingStoryId!);
      this.listStoryFollowingByWriter(this.userProfile?.listFollowingStoryId!);
      this.loadLastChapters();
      this.loadLastChapterIds();

  }
  listStoryFollowingByWriter(listFollowStoryId: number[]){
    this.storyService.getListFollowingByWriter(listFollowStoryId)
    .subscribe({
      next: (result) => {
        this.listStoryFollowing = result;
      }
    })
  }
  loadLastChapters(): void {
    this.listStoryFollowing.forEach((story) => {
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
    this.listStoryFollowing.forEach((story) => {
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
}
