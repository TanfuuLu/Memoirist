import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chapter, ChapterService } from '../../Service/Chapter.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Story, StoryService } from '../../Service/Story.service';

@Component({
  selector: 'app-add-chapter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-chapter.component.html',
  styleUrl: './add-chapter.component.scss'
})
export class AddChapterComponent implements OnInit {
  chapter!: Chapter;
  formAddChapter!: FormGroup;
  storyId!: number;
  storyName?: string | null;
  selectedFile: File | null = null; 
  htmlContent: string = '';
  constructor(private router: ActivatedRoute, private chapterService: ChapterService, private storyService: StoryService, private route: Router){
    this.formAddChapter = new FormGroup({
      chapterTitle: new FormControl(null,Validators.required),
      chapterContext: new FormControl(null,Validators.required),
    })
  }
  
  onSubmit(){
    
    this.chapter = this.formAddChapter.value;
    this.chapter.chapterContext = this.htmlContent; 
    this.chapterService.addChapter(this.storyId, this.chapter)
    .subscribe({
      next: (chapter) => {
        this.chapter = chapter;
        console.log(this.chapter);
       
        this.route.navigate([`/story/${this.storyId}/story-info`])
      }
    })
  }

  ngOnInit(): void {
    this.storyId = Number(this.router.snapshot.paramMap.get('storyId'));
    this.storyService.getStoryById(this.storyId)
    .subscribe({
      next:(story) => {   
        this.storyName = story.storyName;
      }
    })
  }
  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  onUpload(event: Event): void {
    event.preventDefault();
    if (this.selectedFile) {
      this.chapterService.loadWordFile(this.selectedFile).subscribe(
        (response) => {
          this.htmlContent = response.html;
        },
        (error) => {
          console.error('Có lỗi xảy ra:', error);
        }
      );
    } else {
      alert('Vui lòng chọn tệp!');
    }
  }
  mainStory(){
    this.route.navigateByUrl(`/Refresh`, { skipLocationChange: true }).then(() => {
      this.route.navigate([`/story/${this.storyId}/story-info`]);
    });
  }

}
