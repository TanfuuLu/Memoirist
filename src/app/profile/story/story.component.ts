import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent {

}
