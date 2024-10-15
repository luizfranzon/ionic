import { Component, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  isLoginAuthMode = signal<boolean>(true);

  onLogin() {
    this.authService.login();
    this.isLoading.set(true);
    this.loadingCtrl
      .create({
        spinner: 'bubbles',
        message: 'Loggin in...',
        id: 'loginLoading',
      })
      .then((loadingEl) => {
        loadingEl.present();

        setTimeout(() => {
          this.isLoading.set(false);
          loadingEl.dismiss('loginLoading');
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1500);
      });
  }

  onSwitchAuthMode() {
    this.isLoginAuthMode.update((isLogin) => !isLogin);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.isLoginAuthMode()) {
      this.onLogin();
      form.reset();
    } else {
      //a
    }
  }
}
