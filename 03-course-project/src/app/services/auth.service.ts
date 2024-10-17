import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

export interface IAuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  private _user = signal<User | null>(null);

  private firebaseAuthUrl = signal(
    'https://identitytoolkit.googleapis.com/v1/accounts:'
  );

  get userIsAuthenticated(): boolean {
    return !!this._user()?.token;
  }

  get userId() {
    return this._user()?.id;
  }

  login(email: string, password: string) {
    const url = `${this.firebaseAuthUrl()}signInWithPassword?key=${
      environment.firebaseConfig.apiKey
    }`;

    const payload = {
      email,
      password,
      returnSecureToken: true,
    };

    return this.httpClient
      .post<IAuthResponseData>(url, payload)
      .pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: IAuthResponseData) {
    const { idToken, email, localId } = userData;

    const expirationInOneHourFromNow = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );

    this._user.set(
      new User(localId, email, idToken, expirationInOneHourFromNow)
    );
  }

  logout() {
    this._user.set(null);
  }

  signup(email: string, password: string): Observable<IAuthResponseData> {
    const url = `${this.firebaseAuthUrl()}signUp?key=${
      environment.firebaseConfig.apiKey
    }`;

    const payload = {
      email,
      password,
      returnSecureToken: true,
    };

    return this.httpClient
      .post<IAuthResponseData>(url, payload)
      .pipe(tap(this.setUserData.bind(this)));
  }
}
