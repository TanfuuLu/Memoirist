import { Component } from '@angular/core';
import { NewfeedsUserComponent } from '../newfeeds-user/newfeeds-user.component';
import { Router } from 'express';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
