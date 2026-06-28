import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ButtonModule, CardModule, InputTextModule, TagModule],
  template: `
    <main class="flex min-h-dvh items-center justify-center p-4">
      <div class="w-full max-w-md">
        <p-card>
          <ng-template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-book text-2xl" aria-hidden="true"></i>
              <span>PrimeNG Test Page</span>
            </div>
          </ng-template>
          <ng-template #subtitle>vocabulary-ai frontend</ng-template>

          <div class="flex flex-col gap-4">
            <div>
              <p-tag value="PrimeNG ready" icon="pi pi-check" severity="success" />
            </div>

            <label class="flex flex-col gap-2">
              <span>Add a word</span>
              <input
                pInputText
                type="text"
                [(ngModel)]="word"
                placeholder="e.g. serendipity"
                aria-label="Add a word"
              />
            </label>

            @if (word()) {
              <p>
                You typed: <strong>{{ word() }}</strong>
              </p>
            }

            <div class="flex gap-2">
              <p-button label="Save" icon="pi pi-save" />
              <p-button
                label="Clear"
                icon="pi pi-trash"
                severity="secondary"
                (onClick)="word.set('')"
              />
            </div>
          </div>
        </p-card>
      </div>
    </main>
  `,
})
export class Home {
  protected readonly word = signal('');
}
