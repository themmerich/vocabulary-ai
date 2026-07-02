import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { CatalogService } from '../../../core/admin/catalog.service';
import { CrudFeedback } from '../../../core/admin/crud-feedback';
import { LektionDetail as LektionDetailModel } from '../../../core/admin/catalog.models';
import { GrammatikSection } from './grammatik-section';
import { VokabelSection } from './vokabel-section';

/** Detail screen for one Lektion: manages its vocabulary and grammar rules. */
@Component({
  selector: 'app-lektion-detail',
  imports: [RouterLink, TranslocoPipe, VokabelSection, GrammatikSection],
  template: `
    <section class="mx-auto flex max-w-4xl flex-col gap-6">
      <nav class="text-sm">
        <a class="text-primary-600 underline" routerLink="/admin">{{
          'admin.lehrwerke.title' | transloco
        }}</a>
        @if (detail(); as d) {
          <span class="mx-1 text-surface-400">/</span>
          <a class="text-primary-600 underline" [routerLink]="['/admin/lehrwerke', d.lehrwerkId]">{{
            'admin.lektionen.title' | transloco
          }}</a>
        }
        <span class="mx-1 text-surface-400">/</span>
        <span>{{ detail()?.title ?? '…' }}</span>
      </nav>

      <app-vokabel-section
        [lektionId]="lektionId"
        [vokabeln]="detail()?.vokabeln ?? []"
        [loading]="loading()"
        (changed)="reload()"
      />

      <app-grammatik-section
        [lektionId]="lektionId"
        [regeln]="detail()?.grammatikregeln ?? []"
        (changed)="reload()"
      />
    </section>
  `,
})
export class LektionDetail {
  private readonly catalog = inject(CatalogService);
  private readonly feedback = inject(CrudFeedback);
  protected readonly lektionId = inject(ActivatedRoute).snapshot.paramMap.get('lektionId')!;

  protected readonly detail = signal<LektionDetailModel | null>(null);
  protected readonly loading = signal(false);

  constructor() {
    this.reload();
  }

  protected reload(): void {
    this.loading.set(true);
    this.catalog.getLektion(this.lektionId).subscribe({
      next: (detail) => {
        this.detail.set(detail);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.feedback.error();
      },
    });
  }
}
