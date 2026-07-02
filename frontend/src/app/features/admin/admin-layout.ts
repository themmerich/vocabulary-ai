import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CrudFeedback } from '../../core/admin/crud-feedback';

/**
 * Shell for the admin catalog area. Hosts the shared Toast and ConfirmDialog
 * outlets and provides the MessageService and ConfirmationService (plus the
 * CrudFeedback wrapper around them) so every child screen (a routed
 * descendant) shares one instance.
 */
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService, CrudFeedback],
  template: `
    <p-toast />
    <p-confirmdialog />
    <router-outlet />
  `,
})
export class AdminLayout {}
