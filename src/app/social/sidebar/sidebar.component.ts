import { Component, inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { AuthService } from '../../Service/Auth.service';
import { UserProfile, UserService } from '../../Service/User.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isModalOpen = false;
  userForRoute!: string | null;
  userRole!: string | null;
  private readonly platformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    this.userRole = this.authService.getRoleFromToken();
    console.log(this.userRole);
  }
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
    if(isPlatformBrowser(this.platformId)){
      this.userForRoute = sessionStorage.getItem("userId");
    }
    
  }
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  moveToReportDashboard(){
    if(this.userRole == "Admin"){
      this.router.navigate(['/report-dashboard']);
    }else{
      window.location.reload();
    }
    
  }
}
