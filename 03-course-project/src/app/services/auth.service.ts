import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isUserAuthenticated = signal(true);

  get isUserAuthenticated() {
    return this._isUserAuthenticated;
  }

  login() {
    this.isUserAuthenticated.set(true);
  }

  logout() {
    this.isUserAuthenticated.set(false);
  }

  constructor() {}
}
