import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Story, StoryService } from '../../Service/Story.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  frmSearch!: FormGroup;
  listStoryResult!: Story[]
  constructor(private storyService: StoryService){
    this.frmSearch = new FormGroup(
      {
        storyName: new FormControl(null, [Validators.required])
      }
    )
  }
  searchStory(){
    const value = this.frmSearch.get('storyName')?.value;
    this.storyService.searchStory(value)
    .subscribe({
      next: (result) => {
        this.listStoryResult = result;
        console.log(this.listStoryResult);
      }
    })
  }
}

