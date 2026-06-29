import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { AuthUser, Credentials } from './auth.models';

const API = '/api/auth';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly currentUser = signal<AuthUser | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  /** Restores the session on startup. Resolves to `null` when not signed in. */
  loadCurrentUser(): Observable<AuthUser | null> {
    return this.http.get<AuthUser>(`${API}/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      }),
    );
  }

  register(credentials: Credentials): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${API}/register`, credentials)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  login(credentials: Credentials): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${API}/login`, credentials)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${API}/logout`, {}).pipe(tap(() => this.currentUser.set(null)));
  }

  /** Clears the cached user without a server round-trip (e.g. after a 401). */
  clear(): void {
    this.currentUser.set(null);
  }
}
