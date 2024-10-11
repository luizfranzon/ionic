import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  router = inject(Router);
  authService = inject(AuthService);
  loadingCtrl = inject(LoadingController);

  isLoading = signal(false);

  onLogin() {
    this.authService.login();
    this.isLoading.set(true);
    this.loadingCtrl
      .create({
        spinner: 'bubbles',
        message: 'Loggin in...',
      })
      .then((loadingEl) => {
        loadingEl.present();
      });
    setTimeout(() => {
      this.isLoading.set(false);
      this.loadingCtrl.dismiss();
      this.router.navigateByUrl('/places/tabs/discover');
    }, 2000); //Fake network throttling of 2 seconds
  }
}
