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
          path: '',
          redirectTo: '/home/notifications',
          pathMatch: 'full',
        },


    ]
  }

];
