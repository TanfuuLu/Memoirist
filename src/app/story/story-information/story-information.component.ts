import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-story-information',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './story-information.component.html',
  styleUrl: './story-information.component.scss'
})
export class StoryInformationComponent {
  intArray: Array<Number> = [];
  constructor(){
    for (let index = 1; index < 10; index++) {
      this.intArray.push(index);
    }
  }

}
