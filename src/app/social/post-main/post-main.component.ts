import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-post-main',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './post-main.component.html',
  styleUrl: './post-main.component.scss'
})
export class PostMainComponent {

}
