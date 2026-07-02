import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/admin-layout').then((m) => m.AdminLayout),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/admin/lehrwerke/lehrwerk-list').then((m) => m.LehrwerkList),
          },
          {
            path: 'lehrwerke/:lehrwerkId',
            loadComponent: () =>
              import('./features/admin/lektionen/lektion-list').then((m) => m.LektionList),
          },
          {
            path: 'lektionen/:lektionId',
            loadComponent: () =>
              import('./features/admin/lektionen/lektion-detail').then((m) => m.LektionDetail),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
