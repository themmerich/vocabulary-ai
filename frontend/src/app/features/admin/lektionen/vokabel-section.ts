import { Component, computed, inject, input, output, signal } from '@angular/core';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { CatalogService } from '../../../core/admin/catalog.service';
import { CrudFeedback } from '../../../core/admin/crud-feedback';
import { Vokabel } from '../../../core/admin/catalog.models';

const NON_BLANK = /\S/;

type VokabelForm = {
  foreignTerm: string;
  meaningsText: string;
};

/** Manages the vocabulary of one Lektion, including bulk import. Emits `changed` after a mutation. */
@Component({
  selector: 'app-vokabel-section',
  imports: [
    FormField,
    TranslocoPipe,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TextareaModule,
  ],
  template: `
    <div class="flex flex-col gap-3">
      <header class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">{{ 'admin.vokabeln.title' | transloco }}</h1>
        <div class="flex gap-2">
          <p-button
            severity="secondary"
            icon="pi pi-upload"
            [label]="'admin.vokabeln.import' | transloco"
            (onClick)="openImport()"
          />
          <p-button
            icon="pi pi-plus"
            [label]="'admin.vokabeln.new' | transloco"
            (onClick)="openCreate()"
          />
        </div>
      </header>

      <p-table [value]="rows()" [loading]="loading()" dataKey="id">
        <ng-template #header>
          <tr>
            <th class="w-16 text-right">#</th>
            <th>{{ 'admin.vokabeln.field.foreign' | transloco }}</th>
            <th>{{ 'admin.vokabeln.field.meanings' | transloco }}</th>
            <th class="w-28"></th>
          </tr>
        </ng-template>
        <ng-template #body let-vokabel let-i="rowIndex">
          <tr>
            <td class="text-right text-surface-500">{{ i + 1 }}</td>
            <td>{{ vokabel.foreignTerm }}</td>
            <td>{{ vokabel.meaningsLabel }}</td>
            <td>
              <div class="flex justify-end gap-1">
                <p-button
                  type="button"
                  severity="secondary"
                  [text]="true"
                  icon="pi pi-pencil"
                  [ariaLabel]="'admin.action.edit' | transloco"
                  (onClick)="openEdit(vokabel)"
                />
                <p-button
                  type="button"
                  severity="danger"
                  [text]="true"
                  icon="pi pi-trash"
                  [ariaLabel]="'admin.action.delete' | transloco"
                  (onClick)="confirmDelete(vokabel)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="4" class="py-6 text-center text-surface-500">
              {{ 'admin.vokabeln.empty' | transloco }}
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Vokabel dialog -->
    <p-dialog
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      [modal]="true"
      [style]="{ width: '30rem' }"
      [header]="dialogHeader() | transloco"
    >
      <form class="flex flex-col gap-4" novalidate (submit)="save($event)">
        <label class="flex flex-col gap-1">
          <span>{{ 'admin.vokabeln.field.foreign' | transloco }}</span>
          <input pInputText type="text" [formField]="editForm.foreignTerm" />
          @if (submitted() && editForm.foreignTerm().invalid()) {
            <small class="text-red-600" role="alert">{{
              'admin.validation.required' | transloco
            }}</small>
          }
        </label>
        <label class="flex flex-col gap-1">
          <span>{{ 'admin.vokabeln.field.meanings' | transloco }}</span>
          <textarea pTextarea rows="4" [formField]="editForm.meaningsText"></textarea>
          <small class="text-surface-500">{{ 'admin.vokabeln.meaningsHint' | transloco }}</small>
          @if (submitted() && editForm.meaningsText().invalid()) {
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

    <!-- Import dialog -->
    <p-dialog
      [visible]="importDialog()"
      (visibleChange)="importDialog.set($event)"
      [modal]="true"
      [style]="{ width: '34rem' }"
      [header]="'admin.vokabeln.import' | transloco"
    >
      <form class="flex flex-col gap-4" novalidate (submit)="runImport($event)">
        <label class="flex flex-col gap-1">
          <span>{{ 'admin.vokabeln.importLabel' | transloco }}</span>
          <textarea
            pTextarea
            rows="8"
            [value]="importText()"
            (input)="onImportInput($event)"
          ></textarea>
          <small class="text-surface-500">{{ 'admin.vokabeln.importHint' | transloco }}</small>
        </label>
        @if (importMessage(); as messageKey) {
          <p class="text-red-600" role="alert">{{ messageKey | transloco }}</p>
        }
        <div class="flex justify-end gap-2">
          <p-button
            type="button"
            severity="secondary"
            [label]="'admin.action.cancel' | transloco"
            (onClick)="importDialog.set(false)"
          />
          <p-button
            type="submit"
            [label]="'admin.vokabeln.importSubmit' | transloco"
            [loading]="importing()"
            [disabled]="importEmpty()"
          />
        </div>
      </form>
    </p-dialog>
  `,
})
export class VokabelSection {
  readonly lektionId = input.required<string>();
  readonly vokabeln = input.required<Vokabel[]>();
  readonly loading = input(false);
  readonly changed = output<void>();

  private readonly catalog = inject(CatalogService);
  private readonly feedback = inject(CrudFeedback);

  /** Rows with a pre-joined meanings label, so the template stays free of function calls. */
  protected readonly rows = computed(() =>
    this.vokabeln().map((vokabel) => ({ ...vokabel, meaningsLabel: vokabel.meanings.join(', ') })),
  );

  protected readonly dialogVisible = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveError = signal(false);
  protected readonly submitted = signal(false);
  private readonly editingId = signal<string | null>(null);
  protected readonly dialogHeader = computed(() =>
    this.editingId() ? 'admin.vokabeln.edit' : 'admin.vokabeln.new',
  );

  protected readonly model = signal<VokabelForm>({ foreignTerm: '', meaningsText: '' });
  protected readonly editForm = form(this.model, (path) => {
    required(path.foreignTerm);
    pattern(path.foreignTerm, NON_BLANK);
    required(path.meaningsText);
    pattern(path.meaningsText, NON_BLANK);
  });

  protected readonly importDialog = signal(false);
  protected readonly importing = signal(false);
  protected readonly importMessage = signal<string | null>(null);
  protected readonly importText = signal('');
  protected readonly importEmpty = computed(() => this.importText().trim().length === 0);

  protected openCreate(): void {
    this.editingId.set(null);
    this.model.set({ foreignTerm: '', meaningsText: '' });
    this.submitted.set(false);
    this.saveError.set(false);
    this.dialogVisible.set(true);
  }

  protected openEdit(vokabel: Vokabel): void {
    this.editingId.set(vokabel.id);
    this.model.set({
      foreignTerm: vokabel.foreignTerm,
      meaningsText: vokabel.meanings.join('\n'),
    });
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

    const meanings = this.parseMeanings(this.model().meaningsText);
    if (meanings.length === 0) {
      this.saveError.set(true);
      return;
    }

    const payload = { foreignTerm: this.model().foreignTerm, meanings };
    const id = this.editingId();
    const request$ = id
      ? this.catalog.updateVokabel(id, payload)
      : this.catalog.createVokabel(this.lektionId(), payload);

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

  protected confirmDelete(vokabel: Vokabel): void {
    this.feedback.confirmDelete({
      headerKey: 'admin.vokabeln.deleteHeader',
      messageKey: 'admin.vokabeln.deleteMessage',
      params: { term: vokabel.foreignTerm },
      accept: () =>
        this.catalog.deleteVokabel(vokabel.id).subscribe({
          next: () => {
            this.feedback.success('admin.toast.deleted');
            this.changed.emit();
          },
          error: () => this.feedback.error(),
        }),
    });
  }

  protected openImport(): void {
    this.importText.set('');
    this.importMessage.set(null);
    this.importDialog.set(true);
  }

  protected onImportInput(event: Event): void {
    this.importText.set((event.target as HTMLTextAreaElement).value);
  }

  protected runImport(event: Event): void {
    event.preventDefault();
    this.importMessage.set(null);
    const text = this.importText().trim();
    if (text.length === 0) {
      return;
    }

    this.importing.set(true);
    this.catalog.importVokabeln(this.lektionId(), text).subscribe({
      next: (result) => {
        this.importing.set(false);
        if (result.imported === 0) {
          // Nothing was imported: keep the dialog open so the pasted text is not lost.
          this.importMessage.set('admin.vokabeln.importNone');
          return;
        }
        this.importDialog.set(false);
        if (result.skipped > 0) {
          this.feedback.warn('admin.vokabeln.importDoneSkipped', {
            count: result.imported,
            skipped: result.skipped,
          });
        } else {
          this.feedback.success('admin.vokabeln.importDone', { count: result.imported });
        }
        this.changed.emit();
      },
      error: () => {
        this.importing.set(false);
        this.importMessage.set('admin.error.generic');
      },
    });
  }

  /** Splits the meanings field (one meaning per line) into trimmed, non-empty meanings. */
  private parseMeanings(text: string): string[] {
    return text
      .split('\n')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  }
}
