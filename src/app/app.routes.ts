import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./index/index.router').then( m => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./home/home.router').then( m => m.routes)
  },
  {
    path: 'list-groups',
    loadComponent: () => import('./pages/list-groups/list-groups.page').then( m => m.ListGroupsPage)
  },
  {
    path: 'list-suppliers',
    loadComponent: () => import('./pages/list-suppliers/list-suppliers.page').then( m => m.ListSuppliersPage)
  }
];
