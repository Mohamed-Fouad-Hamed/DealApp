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
          path: 'products-by-account/:accountId',
          children:[{
            path:'' ,
            loadComponent: () => import('../pages/products-by-account/products-by-account.page').then( m => m.ProductsByAccountPage),
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
          path: 'account-profile/:accountId',
          loadComponent: () => import('../pages/account-profile/account-profile.page').then( m => m.AccountProfilePage),
          canActivate: [authGuard]
        }
        ,
        {
          path: 'account-product-list/:accountId',
          loadComponent: () => import('../pages/account-product-list/account-product-list.page').then( m => m.AccountProductListPage),
          canActivate: [authGuard]
        }
        ,
        {
          path: 'account-offer/:accountId',
          loadComponent: () => import('../pages/account-offer/account-offer.page').then( m => m.AccountOfferPage),
          canActivate: [authGuard]
        }
        ,
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
