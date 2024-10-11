import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  onLogin() {
    this.authService.login();
    this.router.navigateByUrl('/places/tabs/discover');
  }

  ngOnInit() {}
}
