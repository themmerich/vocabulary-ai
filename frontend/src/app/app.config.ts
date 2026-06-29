import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { providePrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';
import { authErrorInterceptor } from './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authErrorInterceptor])),
    // Restore the session (and prime the CSRF cookie) before the first route resolves.
    provideAppInitializer(() => firstValueFrom(inject(AuthService).loadCurrentUser())),
    provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          // Emit PrimeNG styles into a dedicated CSS layer so Tailwind
          // utilities (declared after it in styles.css) can override them.
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
  ],
};
