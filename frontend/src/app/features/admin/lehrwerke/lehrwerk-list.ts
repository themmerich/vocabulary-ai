import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CatalogService } from '../../../core/admin/catalog.service';
import { CrudFeedback } from '../../../core/admin/crud-feedback';
import { Lehrwerk, LehrwerkInput } from '../../../core/admin/catalog.models';

const NON_BLANK = /\S/;

@Component({
  selector: 'app-lehrwerk-list',
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
      <header class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ 'admin.lehrwerke.title' | transloco }}</h1>
        <p-button
          icon="pi pi-plus"
          [label]="'admin.lehrwerke.new' | transloco"
          (onClick)="openCreate()"
        />
      </header>

      <p-table [value]="lehrwerke()" [loading]="loading()" dataKey="id">
        <ng-template #header>
          <tr>
            <th>{{ 'admin.lehrwerke.field.title' | transloco }}</th>
            <th>{{ 'admin.lehrwerke.field.language' | transloco }}</th>
            <th class="w-24 text-right">{{ 'admin.lehrwerke.field.lessons' | transloco }}</th>
            <th class="w-28"></th>
          </tr>
        </ng-template>
        <ng-template #body let-lehrwerk>
          <tr>
            <td>
              <a class="text-primary-600 underline" [routerLink]="['lehrwerke', lehrwerk.id]">{{
                lehrwerk.title
              }}</a>
            </td>
            <td>{{ lehrwerk.language }}</td>
            <td class="text-right">{{ lehrwerk.lektionCount }}</td>
            <td>
              <div class="flex justify-end gap-1">
                <p-button
                  type="button"
                  severity="secondary"
                  [text]="true"
                  icon="pi pi-pencil"
                  [ariaLabel]="'admin.action.edit' | transloco"
                  (onClick)="openEdit(lehrwerk)"
                />
                <p-button
                  type="button"
                  severity="danger"
                  [text]="true"
                  icon="pi pi-trash"
                  [ariaLabel]="'admin.action.delete' | transloco"
                  (onClick)="confirmDelete(lehrwerk)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="4" class="py-6 text-center text-surface-500">
              {{ 'admin.lehrwerke.empty' | transloco }}
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
          <span>{{ 'admin.lehrwerke.field.title' | transloco }}</span>
          <input pInputText type="text" [formField]="editForm.title" />
          @if (submitted() && editForm.title().invalid()) {
            <small class="text-red-600" role="alert">{{
              'admin.validation.required' | transloco
            }}</small>
          }
        </label>
        <label class="flex flex-col gap-1">
          <span>{{ 'admin.lehrwerke.field.language' | transloco }}</span>
          <input pInputText type="text" [formField]="editForm.language" />
          @if (submitted() && editForm.language().invalid()) {
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
export class LehrwerkList {
  private readonly catalog = inject(CatalogService);
  private readonly feedback = inject(CrudFeedback);

  protected readonly lehrwerke = signal<Lehrwerk[]>([]);
  protected readonly loading = signal(false);

  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal(false);
  protected readonly submitted = signal(false);
  private readonly editingId = signal<string | null>(null);

  protected readonly dialogHeader = computed(() =>
    this.editingId() ? 'admin.lehrwerke.edit' : 'admin.lehrwerke.new',
  );

  protected readonly model = signal<LehrwerkInput>({ title: '', language: '' });
  protected readonly editForm = form(this.model, (path) => {
    required(path.title);
    pattern(path.title, NON_BLANK);
    required(path.language);
    pattern(path.language, NON_BLANK);
  });

  constructor() {
    this.reload();
  }

  private reload(): void {
    this.loading.set(true);
    this.catalog.listLehrwerke().subscribe({
      next: (items) => {
        this.lehrwerke.set(items);
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
    this.model.set({ title: '', language: '' });
    this.openDialog();
  }

  protected openEdit(lehrwerk: Lehrwerk): void {
    this.editingId.set(lehrwerk.id);
    this.model.set({ title: lehrwerk.title, language: lehrwerk.language });
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
      ? this.catalog.updateLehrwerk(id, input)
      : this.catalog.createLehrwerk(input);

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

  protected confirmDelete(lehrwerk: Lehrwerk): void {
    this.feedback.confirmDelete({
      headerKey: 'admin.lehrwerke.deleteHeader',
      messageKey: 'admin.lehrwerke.deleteMessage',
      params: { title: lehrwerk.title },
      accept: () => this.delete(lehrwerk.id),
    });
  }

  private delete(id: string): void {
    this.catalog.deleteLehrwerk(id).subscribe({
      next: () => {
        this.feedback.success('admin.toast.deleted');
        this.reload();
      },
      error: () => this.feedback.error(),
    });
  }
}
