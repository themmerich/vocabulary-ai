import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthUser } from './auth.models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('sets the current user on login', () => {
    const user: AuthUser = { id: '1', email: 'a@b.com', role: 'USER' };
    service.login({ email: 'a@b.com', password: 'password123' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(user);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.isAdmin()).toBe(false);
    expect(service.user()).toEqual(user);
  });

  it('flags admins via isAdmin', () => {
    const admin: AuthUser = { id: '2', email: 'admin@b.com', role: 'ADMIN' };
    service.login({ email: 'admin@b.com', password: 'password123' }).subscribe();
    httpMock.expectOne('/api/auth/login').flush(admin);

    expect(service.isAdmin()).toBe(true);
  });

  it('clears the user on logout', () => {
    service.login({ email: 'a@b.com', password: 'password123' }).subscribe();
    httpMock.expectOne('/api/auth/login').flush({ id: '1', email: 'a@b.com', role: 'USER' });

    service.logout().subscribe();
    httpMock.expectOne('/api/auth/logout').flush(null);

    expect(service.isAuthenticated()).toBe(false);
  });

  it('treats a failed me() as signed out', () => {
    let result: AuthUser | null | undefined;
    service.loadCurrentUser().subscribe((user) => (result = user));
    httpMock.expectOne('/api/auth/me').flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(result).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
