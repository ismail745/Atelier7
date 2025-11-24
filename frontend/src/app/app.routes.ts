import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'employees'
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./employees/employee-list/employee-list.component').then((m) => m.EmployeeListComponent)
      },
      {
        path: 'employees/new',
        loadComponent: () =>
          import('./employees/employee-form/employee-form.component').then((m) => m.EmployeeFormComponent)
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () =>
          import('./employees/employee-form/employee-form.component').then((m) => m.EmployeeFormComponent)
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import('./employees/employee-detail/employee-detail.component').then((m) => m.EmployeeDetailComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'employees'
  }
];
