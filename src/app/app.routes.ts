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

 
 
 
];
