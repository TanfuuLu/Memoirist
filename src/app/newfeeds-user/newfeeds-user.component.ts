import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AppComponent } from "../app.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-newfeeds-user',
  standalone: true,
  imports: [ AppComponent,RouterLink, RouterLinkActive, NgClass],
  templateUrl: './newfeeds-user.component.html',
  styleUrl: './newfeeds-user.component.scss'
})
export class NewfeedsUserComponent {
  isModalOpen = false;
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
