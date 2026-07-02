import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslocoPipe, ButtonModule],
  template: `
    <div class="flex min-h-dvh flex-col">
      <header class="flex items-center justify-between border-b border-surface-200 px-4 py-3">
        <div class="flex items-center gap-4">
          <a routerLink="/" class="flex items-center gap-2 font-semibold">
            <i class="pi pi-book" aria-hidden="true"></i>
            <span>{{ 'app.title' | transloco }}</span>
          </a>

          @if (auth.isAdmin()) {
            <a
              routerLink="/admin"
              routerLinkActive="font-semibold"
              class="text-sm text-primary-600 hover:underline"
            >
              {{ 'admin.nav' | transloco }}
            </a>
          }
        </div>

        @if (auth.user(); as user) {
          <div class="flex items-center gap-3">
            <span class="text-sm">{{ user.email }}</span>
            <p-button
              type="button"
              severity="secondary"
              size="small"
              icon="pi pi-sign-out"
              [label]="'auth.logout' | transloco"
              (onClick)="logout()"
            />
          </div>
        }
      </header>

      <main class="flex-1 p-4">
        <router-outlet />
      </main>
    </div>
  `,
})
export class Shell {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout().subscribe(() => void this.router.navigate(['/login']));
  }
}
