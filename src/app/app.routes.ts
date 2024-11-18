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
    path: 'incoming-orders',
    loadComponent: () => import('./pages/incoming-orders/incoming-orders.page').then( m => m.IncomingOrdersPage)
  },
  {
    path: 'outgoing-orders',
    loadComponent: () => import('./pages/outgoing-orders/outgoing-orders.page').then( m => m.OutgoingOrdersPage)
  }
];
