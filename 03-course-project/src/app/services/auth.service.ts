import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@capacitor/storage';

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

  constructor() {
    this.autoLogin().then((user) => {
      this._user.set(user);
    });
  }

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

    this.storeAuthData(localId, idToken, expirationInOneHourFromNow);
  }

  logout() {
    this._user.set(null);
    Storage.remove({ key: 'authData' });
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

  autoLogin() {
    const result = Storage.get({ key: 'authData' }).then((data) => {
      if (!data || !data.value) {
        return null;
      }

      const parsedData = JSON.parse(data.value) as {
        userId: string;
        token: string;
        tokenExpirationDate: string;
      };

      if (new Date(parsedData.tokenExpirationDate) <= new Date()) {
        Storage.remove({ key: 'authData' });
        return null;
      }

      const expirationTime = new Date(parsedData.tokenExpirationDate);
      const user = new User(
        parsedData.userId,
        '',
        parsedData.token,
        expirationTime
      );

      return user;
    });

    return result;
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: Date
  ) {
    const data = JSON.stringify({ userId, token, tokenExpirationDate });
    Storage.set({ key: 'authData', value: data });
  }
}
