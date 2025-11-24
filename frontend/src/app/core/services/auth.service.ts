import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { tap } from 'rxjs';

import { AuthRequest, AuthResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly authenticated = signal<boolean>(this.hasToken());

  public readonly isAuthenticated = computed(() => this.authenticated());

  constructor(private readonly http: HttpClient) {}

  login(payload: AuthRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response) => {
        if (response?.accessToken) {
          localStorage.setItem(this.tokenKey, response.accessToken);
          this.authenticated.set(true);
        } else {
          console.warn('Login response missing accessToken:', response);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}

