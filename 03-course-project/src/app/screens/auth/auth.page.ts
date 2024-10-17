import { Component, inject, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  LoadingOptions,
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService, IAuthResponseData } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  router = inject(Router);
  authService = inject(AuthService);
  loadingCtrl = inject(LoadingController);
  alertCtrl = inject(AlertController);

  isLoading = signal(false);
  isLoginMode = signal<boolean>(true);

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const { email, password } = form.value;

    this.authenticate(email, password);
  }

  private authenticate(email: string, password: string) {
    this.isLoading.set(true);

    const loadingOptions: LoadingOptions = {
      spinner: 'bubbles',
      message: 'Loggin in...',
      id: 'loginLoading',
    };

    this.loadingCtrl.create(loadingOptions).then((loadingEl) => {
      loadingEl.present();

      let authObservable: Observable<IAuthResponseData>;

      if (this.isLoginMode()) {
        authObservable = this.authService.login(email, password);
      } else {
        authObservable = this.authService.signup(email, password);
      }

      authObservable.subscribe({
        next: (response) => {
          if (response.idToken) {
            this.router.navigateByUrl('/places/tabs/discover');
          }
        },
        error: (error) => {
          const errorCode = error.error.error.message;
          let errorMessage: string;

          if (errorCode === 'INVALID_LOGIN_CREDENTIALS') {
            errorMessage = 'E-mail ou senha incorretos.';
          } else if (errorCode === 'EMAIL_EXISTS') {
            errorMessage = 'Esse e-mail já foi utilizado em outra conta.';
          } else {
            errorMessage = 'Erro desconhecido!';
          }

          this.showAlert(errorMessage);
        },
      });

      this.isLoading.set(false);
      loadingEl.dismiss();
    });
  }

  onSwitchAuthMode() {
    this.isLoginMode.update((isLogin) => !isLogin);
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Failed!',
        message,
        buttons: [
          {
            text: 'Ok',
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
