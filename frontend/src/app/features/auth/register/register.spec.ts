import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { Register } from './register';
import { provideTranslocoTesting } from '../../../../testing/transloco-testing';

describe('Register', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, provideTranslocoTesting()],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    expect(TestBed.createComponent(Register).componentInstance).toBeTruthy();
  });

  it('renders the create-account title', async () => {
    const fixture = TestBed.createComponent(Register);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Create account');
  });
});
