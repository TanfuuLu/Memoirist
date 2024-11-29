import { Component, inject } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './social/sidebar/sidebar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
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
