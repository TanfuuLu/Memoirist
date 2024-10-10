import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-newfeeds-user',
  standalone: true,
  imports: [SidebarComponent, AppComponent],
  templateUrl: './newfeeds-user.component.html',
  styleUrl: './newfeeds-user.component.scss'
})
export class NewfeedsUserComponent {

}
