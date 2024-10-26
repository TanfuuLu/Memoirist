import { Component, inject } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Memoirist';
  router = inject(Router);
  urlName!: boolean;
  constructor() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((
      event: NavigationEnd
    ) => {
      this.locationUrl(event.urlAfterRedirects);
      console.log(this.urlName);
    })

  }
  locationUrl(url: string) {
    url = url.replace('/', '');
    if (url == 'login' || url == 'sign-in') {
      this.urlName = true;
    } else {
      this.urlName = false;
    }
  }

}
