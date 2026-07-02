import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CatalogService } from '../../../core/admin/catalog.service';
import { CrudFeedback } from '../../../core/admin/crud-feedback';
import { Lehrwerk, Lektion, LektionInput } from '../../../core/admin/catalog.models';

const NON_BLANK = /\S/;

@Component({
  selector: 'app-lektion-list',
  imports: [
    RouterLink,
    FormField,
    TranslocoPipe,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TableModule,
  ],
  template: `
    <section class="mx-auto flex max-w-4xl flex-col gap-4">
      <nav class="text-sm">
        <a class="text-primary-600 underline" routerLink="/admin">{{
          'admin.lehrwerke.title' | transloco
        }}</a>
        <span class="mx-1 text-surface-400">/</span>
        <span>{{ lehrwerk()?.title ?? '…' }}</span>
      </nav>

      <header class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ 'admin.lektionen.title' | transloco }}</h1>
        <p-button
          icon="pi pi-plus"
          [label]="'admin.lektionen.new' | transloco"
          (onClick)="openCreate()"
        />
      </header>

      <p-table [value]="lektionen()" [loading]="loading()" dataKey="id">
        <ng-template #header>
          <tr>
            <th class="w-16 text-right">#</th>
            <th>{{ 'admin.lektionen.field.title' | transloco }}</th>
            <th class="w-28"></th>
          </tr>
        </ng-template>
        <ng-template #body let-lektion let-i="rowIndex">
          <tr>
            <td class="text-right text-surface-500">{{ i + 1 }}</td>
            <td>
              <a
                class="text-primary-600 underline"
                [routerLink]="['/admin/lektionen', lektion.id]"
                >{{ lektion.title }}</a
              >
            </td>
            <td>
              <div class="flex justify-end gap-1">
                <p-button
                  type="button"
                  severity="secondary"
                  [text]="true"
                  icon="pi pi-pencil"
                  [ariaLabel]="'admin.action.edit' | transloco"
                  (onClick)="openEdit(lektion)"
                />
                <p-button
                  type="button"
                  severity="danger"
                  [text]="true"
                  icon="pi pi-trash"
                  [ariaLabel]="'admin.action.delete' | transloco"
                  (onClick)="confirmDelete(lektion)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="3" class="py-6 text-center text-surface-500">
              {{ 'admin.lektionen.empty' | transloco }}
            </td>
          </tr>
        </ng-template>
      </p-table>
    </section>

    <p-dialog
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      [modal]="true"
      [style]="{ width: '28rem' }"
      [header]="dialogHeader() | transloco"
    >
      <form class="flex flex-col gap-4" novalidate (submit)="save($event)">
        <label class="flex flex-col gap-1">
          <span>{{ 'admin.lektionen.field.title' | transloco }}</span>
          <input pInputText type="text" [formField]="editForm.title" />
          @if (submitted() && editForm.title().invalid()) {
            <small class="text-red-600" role="alert">{{
              'admin.validation.required' | transloco
            }}</small>
          }
        </label>
        @if (saveError()) {
          <p class="text-red-600" role="alert">{{ 'admin.error.generic' | transloco }}</p>
        }
        <div class="flex justify-end gap-2">
          <p-button
            type="button"
            severity="secondary"
            [label]="'admin.action.cancel' | transloco"
            (onClick)="dialogVisible.set(false)"
          />
          <p-button type="submit" [label]="'admin.action.save' | transloco" [loading]="saving()" />
        </div>
      </form>
    </p-dialog>
  `,
})
export class LektionList {
  private readonly catalog = inject(CatalogService);
  private readonly feedback = inject(CrudFeedback);
  private readonly lehrwerkId = inject(ActivatedRoute).snapshot.paramMap.get('lehrwerkId')!;

  protected readonly lehrwerk = signal<Lehrwerk | null>(null);
  protected readonly lektionen = signal<Lektion[]>([]);
  protected readonly loading = signal(false);

  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal(false);
  protected readonly submitted = signal(false);
  private readonly editingId = signal<string | null>(null);

  protected readonly dialogHeader = computed(() =>
    this.editingId() ? 'admin.lektionen.edit' : 'admin.lektionen.new',
  );

  protected readonly model = signal<LektionInput>({ title: '' });
  protected readonly editForm = form(this.model, (path) => {
    required(path.title);
    pattern(path.title, NON_BLANK);
  });

  constructor() {
    this.catalog.getLehrwerk(this.lehrwerkId).subscribe({
      next: (lehrwerk) => this.lehrwerk.set(lehrwerk),
      error: () => this.feedback.error(),
    });
    this.reload();
  }

  private reload(): void {
    this.loading.set(true);
    this.catalog.listLektionen(this.lehrwerkId).subscribe({
      next: (items) => {
        this.lektionen.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.feedback.error();
      },
    });
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.model.set({ title: '' });
    this.openDialog();
  }

  protected openEdit(lektion: Lektion): void {
    this.editingId.set(lektion.id);
    this.model.set({ title: lektion.title });
    this.openDialog();
  }

  private openDialog(): void {
    this.submitted.set(false);
    this.saveError.set(false);
    this.dialogVisible.set(true);
  }

  protected save(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    this.saveError.set(false);
    if (this.editForm().invalid()) {
      return;
    }

    const id = this.editingId();
    const input = this.model();
    const request$ = id
      ? this.catalog.updateLektion(id, input)
      : this.catalog.createLektion(this.lehrwerkId, input);

    this.saving.set(true);
    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.feedback.success('admin.toast.saved');
        this.reload();
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set(true);
      },
    });
  }

  protected confirmDelete(lektion: Lektion): void {
    this.feedback.confirmDelete({
      headerKey: 'admin.lektionen.deleteHeader',
      messageKey: 'admin.lektionen.deleteMessage',
      params: { title: lektion.title },
      accept: () => this.delete(lektion.id),
    });
  }

  private delete(id: string): void {
    this.catalog.deleteLektion(id).subscribe({
      next: () => {
        this.feedback.success('admin.toast.deleted');
        this.reload();
      },
      error: () => this.feedback.error(),
    });
  }
}
