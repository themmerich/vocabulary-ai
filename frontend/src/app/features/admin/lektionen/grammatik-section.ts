import { Component, computed, inject, input, output, signal } from '@angular/core';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CatalogService } from '../../../core/admin/catalog.service';
import { CrudFeedback } from '../../../core/admin/crud-feedback';
import { Grammatikregel, GrammatikregelInput } from '../../../core/admin/catalog.models';

const NON_BLANK = /\S/;

/** Manages the grammar rules of one Lektion. Emits `changed` after a mutation. */
@Component({
  selector: 'app-grammatik-section',
  imports: [FormField, TranslocoPipe, ButtonModule, DialogModule, InputTextModule, TextareaModule],
  template: `
    <div class="flex flex-col gap-3">
      <header class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">{{ 'admin.grammatik.title' | transloco }}</h2>
        <p-button
          icon="pi pi-plus"
          [label]="'admin.grammatik.new' | transloco"
          (onClick)="openCreate()"
        />
      </header>

      @if (regeln().length === 0) {
        <p class="text-surface-500">{{ 'admin.grammatik.empty' | transloco }}</p>
      } @else {
        <ul class="flex flex-col gap-2">
          @for (regel of regeln(); track regel.id) {
            <li
              class="flex items-start justify-between gap-3 rounded border border-surface-200 p-3"
            >
              <div class="flex flex-col gap-1">
                <span class="font-medium">{{ regel.title }}</span>
                <span class="whitespace-pre-line text-sm text-surface-600">{{
                  regel.content
                }}</span>
              </div>
              <div class="flex shrink-0 gap-1">
                <p-button
                  type="button"
                  severity="secondary"
                  [text]="true"
                  icon="pi pi-pencil"
                  [ariaLabel]="'admin.action.edit' | transloco"
                  (onClick)="openEdit(regel)"
                />
                <p-button
                  type="button"
                  severity="danger"
                  [text]="true"
                  icon="pi pi-trash"
                  [ariaLabel]="'admin.action.delete' | transloco"
                  (onClick)="confirmDelete(regel)"
                />
              </div>
            </li>
          }
        </ul>
      }
    </div>

    <p-dialog
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      [modal]="true"
      [style]="{ width: '32rem' }"
      [header]="dialogHeader() | transloco"
    >
      <form class="flex flex-col gap-4" novalidate (submit)="save($event)">
        <label class="flex flex-col gap-1">
          <span>{{ 'admin.grammatik.field.title' | transloco }}</span>
          <input pInputText type="text" [formField]="editForm.title" />
          @if (submitted() && editForm.title().invalid()) {
            <small class="text-red-600" role="alert">{{
              'admin.validation.required' | transloco
            }}</small>
          }
        </label>
        <label class="flex flex-col gap-1">
          <span>{{ 'admin.grammatik.field.content' | transloco }}</span>
          <textarea pTextarea rows="5" [formField]="editForm.content"></textarea>
          @if (submitted() && editForm.content().invalid()) {
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
export class GrammatikSection {
  readonly lektionId = input.required<string>();
  readonly regeln = input.required<Grammatikregel[]>();
  readonly changed = output<void>();

  private readonly catalog = inject(CatalogService);
  private readonly feedback = inject(CrudFeedback);

  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal(false);
  protected readonly submitted = signal(false);
  private readonly editingId = signal<string | null>(null);

  protected readonly dialogHeader = computed(() =>
    this.editingId() ? 'admin.grammatik.edit' : 'admin.grammatik.new',
  );

  protected readonly model = signal<GrammatikregelInput>({ title: '', content: '' });
  protected readonly editForm = form(this.model, (path) => {
    required(path.title);
    pattern(path.title, NON_BLANK);
    required(path.content);
    pattern(path.content, NON_BLANK);
  });

  protected openCreate(): void {
    this.editingId.set(null);
    this.model.set({ title: '', content: '' });
    this.openDialog();
  }

  protected openEdit(regel: Grammatikregel): void {
    this.editingId.set(regel.id);
    this.model.set({ title: regel.title, content: regel.content });
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

    const payload = this.model();
    const id = this.editingId();
    const request$ = id
      ? this.catalog.updateGrammatikregel(id, payload)
      : this.catalog.createGrammatikregel(this.lektionId(), payload);

    this.saving.set(true);
    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.feedback.success('admin.toast.saved');
        this.changed.emit();
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set(true);
      },
    });
  }

  protected confirmDelete(regel: Grammatikregel): void {
    this.feedback.confirmDelete({
      headerKey: 'admin.grammatik.deleteHeader',
      messageKey: 'admin.grammatik.deleteMessage',
      params: { title: regel.title },
      accept: () =>
        this.catalog.deleteGrammatikregel(regel.id).subscribe({
          next: () => {
            this.feedback.success('admin.toast.deleted');
            this.changed.emit();
          },
          error: () => this.feedback.error(),
        }),
    });
  }
}
