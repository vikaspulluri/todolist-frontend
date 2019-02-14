import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { config } from '../app.config';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { Subject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { SignUpResponse } from './response.model';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../shared/socket.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  private token;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId;
  private username;

  constructor(private http: HttpClient, private router: Router, private toastrService: ToastrService,
    private socketService: SocketService) {}

  getToken() {
    return this.token;
  }

  getUsername() {
    return this.username || '';
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  setAuthInfo(response) {
    const expiresInDuration = response.data.expiryDuration;
    this.token = response.data.token;
    this.isAuthenticated = true;
    this.username = response.data.username;
    this.userId = response.data.userId;
    this.setAuthTimer(expiresInDuration);
    const now = new Date();
    const expiration = new Date(now.getTime() + expiresInDuration * 1000);
    this.saveAuthData(this.token, expiration, response.data.userId, response.data.username);
    this.authStatusListener.next(true);
  }

  createUser(user: User) {
    return this.http.post(`${config.apiUrl}/api/user/create`, user);
  }
  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    return this.http.post<SignUpResponse>(`${config.apiUrl}/api/user/login`, authData);
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.socketService.disconnectSocket(this.getToken());
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const userData = {authToken: authInfo.token, friendsList: []};
    this.socketService.setUser(userData);
    const now = new Date();
    const expiresIn = authInfo.expiration.getTime() - now.getTime();
    if (expiresIn) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.username = authInfo.username;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  public updateAuthData(username: string) {
    localStorage.removeItem('username');
    localStorage.setItem('username', username);
    this.username = username;
    this.authStatusListener.next(true);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!token || !expiration) {
      return;
    }
    return {
      token: token,
      expiration: new Date(expiration),
      userId: userId,
      username: username
    };
  }

  public requestPassword(email: String) {
    return this.http.post<{error: boolean, message: string}>(`${config.apiUrl}/api/user/request-password`, {email: email});
  }

  public resetPassword(data: {verificationCode: string, newPassword: string}) {
    return this.http.post<{error: boolean, message: string}>(`${config.apiUrl}/api/user/reset-password`, data);
  }
}
