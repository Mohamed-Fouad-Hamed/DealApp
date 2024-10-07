import { Routes } from '@angular/router';
import { HomePage } from './home.page';
import { authGuard } from '../services/Auth-functions/AuthGuard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children:[
        {
            path: 'main-page',
            children:[{
              path:'',
              loadComponent: () => import('../pages/main-page/main-page.page').then((m) => m.MainPagePage),
              canActivate: [authGuard]
            }]
           
        },
        {
          path: 'main-page/list-groups',
          children:[{
            path:'',
            loadComponent: () => import('../pages/list-groups/list-groups.page').then((m) => m.ListGroupsPage),
            canActivate: [authGuard]
          }]
         
        },
        {
          path:'main-page/group-details/:groupId',
          children:[
            {
              path: '',
              loadComponent: () => import('../pages/group-details/group-details.page').then( m => m.GroupDetailsPage),
              canActivate: [authGuard]
            }]

        },
        {
            path: 'cart-page',
            children:[{
              path:'',
              loadComponent: () => import('../pages/cart-page/cart-page.page').then((m) => m.CartPagePage),
              canActivate: [authGuard]
            }]
            
        },
        {
            path: 'suppliers-page',
            children:[{
              path:'' ,
              loadComponent: () => import('../pages/suppliers-page/suppliers-page.page').then((m) => m.SuppliersPagePage),
              canActivate: [authGuard]
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
          redirectTo: '/login',
          pathMatch: 'full',
        }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  }

];
