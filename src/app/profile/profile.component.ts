import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NewfeedsUserComponent } from '../newfeeds-user/newfeeds-user.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SidebarComponent,NewfeedsUserComponent,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  selectedOption?: string ="";
}
