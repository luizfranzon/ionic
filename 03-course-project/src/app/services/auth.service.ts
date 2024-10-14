import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isUserAuthenticated = signal(true);
  private _userId = signal('1');

  get isUserAuthenticated() {
    return this._isUserAuthenticated;
  }

  get userId() {
    return this._userId;
  }

  login() {
    this.isUserAuthenticated.set(true);
  }

  logout() {
    this.isUserAuthenticated.set(false);
  }

  constructor() {}
}
