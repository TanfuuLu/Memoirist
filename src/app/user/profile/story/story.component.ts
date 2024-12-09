import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StoryReponse, StoryService } from '../../../Service/Story.service';
import { AuthService } from '../../../Service/Auth.service';
import { UserProfile } from '../../../Service/User.service';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent implements OnInit {
  @Input() userProfile?: UserProfile; 
  listStoryUser!: StoryReponse[];
  constructor(private storyService: StoryService, private authService: AuthService){

  }
  ngOnInit(): void {
    this.storyService.getListStoryWriter(this.userProfile?.writerId!)
    .subscribe({
      next:(story) => {
        this.listStoryUser = story;
        console.log(this.listStoryUser);
      }
    })
  }
}
