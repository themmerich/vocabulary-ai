import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/auth/auth.service';
import { Credentials } from '../../../core/auth/auth.models';

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink, TranslocoPipe, ButtonModule, CardModule, InputTextModule],
  template: `
    <main class="flex min-h-dvh items-center justify-center p-4">
      <div class="w-full max-w-md">
        <p-card>
          <ng-template #title>{{ 'auth.login.title' | transloco }}</ng-template>

          <form class="flex flex-col gap-4" novalidate (submit)="onSubmit($event)">
            <label class="flex flex-col gap-1">
              <span>{{ 'auth.field.email' | transloco }}</span>
              <input pInputText type="email" autocomplete="email" [formField]="loginForm.email" />
              @if (emailErrorsVisible()) {
                @for (error of loginForm.email().errors(); track error.kind) {
                  <small class="text-red-600" role="alert">{{ error.message | transloco }}</small>
                }
              }
            </label>

            <label class="flex flex-col gap-1">
              <span>{{ 'auth.field.password' | transloco }}</span>
              <input
                pInputText
                type="password"
                autocomplete="current-password"
                [formField]="loginForm.password"
              />
              @if (passwordErrorsVisible()) {
                @for (error of loginForm.password().errors(); track error.kind) {
                  <small class="text-red-600" role="alert">{{ error.message | transloco }}</small>
                }
              }
            </label>

            @if (serverError(); as serverErrorKey) {
              <p class="text-red-600" role="alert">{{ serverErrorKey | transloco }}</p>
            }

            <p-button
              type="submit"
              [label]="'auth.login.submit' | transloco"
              [loading]="submitting()"
            />

            <p class="text-sm">
              {{ 'auth.login.noAccount' | transloco }}
              <a routerLink="/register" class="underline">{{
                'auth.login.registerLink' | transloco
              }}</a>
            </p>
          </form>
        </p-card>
      </div>
    </main>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly model = signal<Credentials>({ email: '', password: '' });
  protected readonly loginForm = form(this.model, (path) => {
    required(path.email, { message: 'auth.validation.emailRequired' });
    email(path.email, { message: 'auth.validation.emailInvalid' });
    required(path.password, { message: 'auth.validation.passwordRequired' });
  });

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected readonly emailErrorsVisible = computed(
    () =>
      (this.loginForm.email().touched() || this.submitted()) && this.loginForm.email().invalid(),
  );
  protected readonly passwordErrorsVisible = computed(
    () =>
      (this.loginForm.password().touched() || this.submitted()) &&
      this.loginForm.password().invalid(),
  );

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    this.serverError.set(null);

    if (this.loginForm().invalid()) {
      return;
    }

    this.submitting.set(true);
    this.auth.login(this.model()).subscribe({
      next: () => void this.router.navigate(['/']),
      error: (error: HttpErrorResponse) => {
        this.submitting.set(false);
        this.serverError.set(
          error.status === 401 ? 'auth.error.invalidCredentials' : 'auth.error.generic',
        );
      },
    });
  }
}
