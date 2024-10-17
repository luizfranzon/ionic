import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
interface NavigationItem {
  title: string;
  icon: string;
  url?: string;
  handler?: () => void;
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  navigationMenuItems: NavigationItem[] = [
    {
      title: 'Discover Places',
      icon: 'business',
      url: '/places/tabs/discover',
    },
    {
      title: 'Your Bookings',
      icon: 'checkbox-outline',
      url: '/bookings',
    },
    {
      title: 'Logout',
      icon: 'exit',
      handler: () => this.onLogout(),
    },
  ];

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
