import { Routes } from '@angular/router';
import { HomePage } from './home.page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children:[
        {
            path: 'main-page',
            children:[{
              path:'',
              loadComponent: () => import('../pages/main-page/main-page.page').then((m) => m.MainPagePage)
            }]
           
        },
        {
          path: 'main-page/list-groups',
          children:[{
            path:'',
            loadComponent: () => import('../pages/list-groups/list-groups.page').then((m) => m.ListGroupsPage)
          }]
         
        },
        {
            path: 'cart-page',
            children:[{
              path:'',
              loadComponent: () => import('../pages/cart-page/cart-page.page').then((m) => m.CartPagePage)
            }]
            
        },
        {
            path: 'suppliers-page',
            children:[{
              path:'' ,
              loadComponent: () => import('../pages/suppliers-page/suppliers-page.page').then((m) => m.SuppliersPagePage)
            }]
           
        }
        ,
        {
            path: 'offer-suppliers-page',
            children:[{
              path : ''  ,
              loadComponent: () => import('../pages/offer-suppliers-page/offer-suppliers-page.page').then((m) => m.OfferSuppliersPagePage)
            }]
           
        },
        {
          path: '',
          redirectTo: '/home/main-page',
          pathMatch: 'full',
        }
    ]
  },
  {
    path: '',
    redirectTo: '/home/main-page',
    pathMatch: 'full',
  }

];
