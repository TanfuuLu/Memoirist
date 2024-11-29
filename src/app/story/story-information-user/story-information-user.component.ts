import { Component } from '@angular/core';

@Component({
  selector: 'app-story-information-user',
  standalone: true,
  imports: [],
  templateUrl: './story-information-user.component.html',
  styleUrl: './story-information-user.component.scss'
})
export class StoryInformationUserComponent {
  intArray: Array<Number> = [];
  constructor(){
    for (let index = 1; index < 10; index++) {
      this.intArray.push(index);
    }
  }
}
