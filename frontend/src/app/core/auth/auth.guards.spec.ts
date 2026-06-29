import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './auth.guards';
import { AuthService } from './auth.service';

type AuthStub = Pick<AuthService, 'isAuthenticated' | 'isAdmin'>;

const route = {} as ActivatedRouteSnapshot;
const state = {} as RouterStateSnapshot;

function configure(stub: Partial<Record<keyof AuthStub, () => boolean>>): void {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: AuthService, useValue: stub }],
  });
}

describe('authGuard', () => {
  it('allows authenticated users', () => {
    configure({ isAuthenticated: () => true });
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('redirects anonymous users to /login', () => {
    configure({ isAuthenticated: () => false });
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });
});

describe('guestGuard', () => {
  it('redirects authenticated users to the root', () => {
    configure({ isAuthenticated: () => true });
    const result = TestBed.runInInjectionContext(() => guestGuard(route, state));
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/');
  });

  it('allows anonymous users', () => {
    configure({ isAuthenticated: () => false });
    const result = TestBed.runInInjectionContext(() => guestGuard(route, state));
    expect(result).toBe(true);
  });
});

describe('adminGuard', () => {
  it('allows admins', () => {
    configure({ isAdmin: () => true });
    const result = TestBed.runInInjectionContext(() => adminGuard(route, state));
    expect(result).toBe(true);
  });

  it('redirects non-admins to the root', () => {
    configure({ isAdmin: () => false });
    const result = TestBed.runInInjectionContext(() => adminGuard(route, state));
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/');
  });
});
