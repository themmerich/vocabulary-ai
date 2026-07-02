import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService, MessageService } from 'primeng/api';

type TranslateParams = Record<string, unknown>;

/**
 * Shared confirm-delete and toast feedback for the admin catalog screens, so the
 * dialog config and toast wiring live in one place instead of being copy-pasted
 * into every list/section component.
 *
 * Not root-provided: it depends on the ConfirmationService/MessageService
 * instances scoped to AdminLayout, so AdminLayout provides it alongside them.
 */
@Injectable()
export class CrudFeedback {
  private readonly confirmation = inject(ConfirmationService);
  private readonly messages = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  /** Opens the standard danger confirm dialog; runs `accept` when confirmed. */
  confirmDelete(options: {
    headerKey: string;
    messageKey: string;
    params?: TranslateParams;
    accept: () => void;
  }): void {
    this.confirmation.confirm({
      header: this.transloco.translate(options.headerKey),
      message: this.transloco.translate(options.messageKey, options.params),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: {
        label: this.transloco.translate('admin.action.delete'),
        severity: 'danger',
      },
      rejectButtonProps: {
        label: this.transloco.translate('admin.action.cancel'),
        severity: 'secondary',
        text: true,
      },
      accept: options.accept,
    });
  }

  success(key: string, params?: TranslateParams): void {
    this.messages.add({ severity: 'success', summary: this.transloco.translate(key, params) });
  }

  warn(key: string, params?: TranslateParams): void {
    this.messages.add({ severity: 'warn', summary: this.transloco.translate(key, params) });
  }

  error(key = 'admin.error.generic'): void {
    this.messages.add({ severity: 'error', summary: this.transloco.translate(key) });
  }
}
