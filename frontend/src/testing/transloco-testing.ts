import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';

// Mirrors public/i18n/en.json closely enough for component assertions.
const en = {
  app: { title: 'vocabulary-ai' },
  auth: {
    field: { email: 'Email', password: 'Password' },
    login: {
      title: 'Sign in',
      submit: 'Sign in',
      noAccount: 'No account yet?',
      registerLink: 'Create one',
    },
    register: {
      title: 'Create account',
      submit: 'Create account',
      haveAccount: 'Already have an account?',
      loginLink: 'Sign in',
    },
    logout: 'Sign out',
    validation: {
      emailRequired: 'Email is required',
      emailInvalid: 'Enter a valid email address',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 8 characters',
    },
    error: {
      invalidCredentials: 'Invalid email or password',
      emailTaken: 'That email is already registered',
      generic: 'Something went wrong. Please try again.',
    },
  },
  home: { welcome: 'Welcome', placeholder: 'Your vocabulary workspace will appear here.' },
};

/** Provides Transloco for component tests using static English translations. */
export function provideTranslocoTesting(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { en },
    translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
    preloadLangs: true,
    ...options,
  });
}
