import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-add-story',
  standalone: true,
  imports: [ NgClass, ReactiveFormsModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './add-story.component.html',
  styleUrl: './add-story.component.scss'
})
export class AddStoryComponent {
  listStoryName = [
    {key:'0', value:'none'},
    {key:'1', value:'Gia Thien'},
    {key:'2', value:'Linh Vu Thien Ha'}
  ];
  isModalOpen = false;
  existedStory: string = 'none';
  formAddStory!: FormGroup;
  constructor(){
    this.formAddStory = new FormGroup({
      storyName: new FormControl('', Validators.required),
      storyBio: new FormControl('',Validators.required),
      acceptedTerms: new FormControl(false,Validators.required),
      storyContext: new FormControl('',Validators.minLength(500))
    })
  }
  onSubmit(){
    console.log(this.formAddStory.value);
    console.log(this.formAddStory.controls['acceptedTerms'].value);
  }
  openModal(){
    this.isModalOpen =true;
  }
  closeModal(){
    this.isModalOpen = false;
  }
  closeModalClickOutside(event: MouseEvent){
    const targetElement = event.target as HTMLElement;
    if(targetElement.classList.contains('fixed')){
      this.closeModal();
    }
  }

}
