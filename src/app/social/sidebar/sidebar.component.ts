import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../Service/Auth.service';
import { UserProfile, UserService } from '../../Service/User.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isModalOpen = false;
  userLogin!: UserProfile;
  userForRoute = sessionStorage.getItem('userId');
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
  constructor(private authService: AuthService, private router: Router, private userService: UserService){
    
  }
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
