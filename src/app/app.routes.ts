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
    path: 'product',
    loadComponent: () => import('./pages/product/product.page').then( m => m.ProductPage)
  },
  {
    path: 'category',
    loadComponent: () => import('./pages/category/category.page').then( m => m.CategoryPage)
  },

 
 
 
];
