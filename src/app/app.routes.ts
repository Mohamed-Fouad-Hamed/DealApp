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
    path: 'group',
    loadComponent: () => import('./pages/group/group.page').then( m => m.GroupPage)
  },
  {
    path: 'group-profile',
    loadComponent: () => import('./pages/group-profile/group-profile.page').then( m => m.GroupProfilePage)
  }
];
