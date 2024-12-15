import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../Service/User.service';
import { AddStory, StoryService } from '../../Service/Story.service';
import { AuthService } from '../../Service/Auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-story',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-story.component.html',
  styleUrl: './add-story.component.scss',
})
// writerStoryid?: Number | null; // lay tu user
// storyName?: String | null;
// storyIntroduction?: String | null;
// storyAuthor?: String | null;
// storyPicture?: String | null;
// storyDateWrited?: String |null;
// termsAndConditionsCheck?: boolean;
export class AddStoryComponent implements OnInit{
  addStory!: AddStory;
  isModalOpen = false;
  existedStory: string = 'none';
  formAddStory!: FormGroup;
  imagePreviews: string = '';
  currentDate = new Date();
  imageFileName: string = '';
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  closeModalClickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('fixed')) {
      this.closeModal();
    }
  }
  formattedDate = this.currentDate.toLocaleDateString('vi-VN');
  constructor(
    private userService: UserService,
    private storyService: StoryService,
    private authService: AuthService,
    private route: Router
  ) {
    this.formAddStory = new FormGroup({
      storyName: new FormControl('', Validators.required),
      storyIntroduction: new FormControl('', Validators.required),
      termsAndConditionsCheck: new FormControl(true, Validators.required),
      storyPicture: new FormControl(null),
    });
  }
  onSubmit() {
    this.addStory = this.formAddStory.value;
    this.authService.currentUser$.subscribe(user => {
      this.addStory.storyAuthor = user.writerFullname;
      this.addStory.storyDateWrited = this.formattedDate;
      this.addStory.writerStoryId = user.writerId;
      this.addStory.storyPicture = this.imageFileName;
    });
    this.storyService.addStory(this.addStory)
    .subscribe({
      next: (story) => {
        if(this.addStory.termsAndConditionsCheck == true){
          this.route.navigate([`/story/${story.storyId}/story-info`]);
        }
      }
    })
   
  }
  ngOnInit(): void {
    this.authService.checkLogin();

    this.authService.loadCurrentUser();
  }
  onFileSelected(event: Event): void {  
    const input = event.target as HTMLInputElement;
  
    if (input && input.files && input.files.length > 0) {
      const file: File = input.files[0];
  
      const reader = new FileReader();
      this.imageFileName = file.name;
      reader.onload = () => {
        if (reader.result) {
          this.imagePreviews = reader.result.toString();
        }
      };
  
      reader.onerror = (err) => {
        console.error('Error reading file:', err);
      };
  
      reader.readAsDataURL(file);
    } else {
      console.warn('No file selected!');
    }
  }
  isStoryValid(): boolean {
    return this.formAddStory.get('storyName')?.value.trim().length > 0 && this.formAddStory.get('storyIntroduction')?.value.trim().length > 0;
  }
}
