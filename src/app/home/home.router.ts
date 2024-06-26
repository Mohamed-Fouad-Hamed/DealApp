import { Routes } from '@angular/router';
import { HomePage } from './home.page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children:[
        {
            path: 'notifications',
            loadComponent: () => import('../pages/notifications/notifications.page').then((m) => m.NotificationsPage)
        },
        {
            path: 'messages',
            loadComponent: () => import('../pages/messages/messages.page').then((m) => m.MessagesPage)
        },
        {
            path: 'settings',
            loadComponent: () => import('../pages/settings/settings.page').then((m) => m.SettingsPage)
        },
        {
          path: 'category',
          loadComponent: () => import('../pages/category/category.page').then((m) => m.CategoryPage)
        },
        {
          path: 'product',
          loadComponent: () => import('../pages/product/product.page').then((m) => m.ProductPage)
        },
        {
          path: '',
          redirectTo: '/home/notifications',
          pathMatch: 'full',
        },


    ]
  }

];
