import { Routes } from '@angular/router';
import { IndexPage } from './index.page';
import { authGuard } from '../services/Auth-functions/AuthGuard';

export const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    children:[
         {
            path: '',
            loadComponent: () => import('../pages/welcome/welcome.page').then((m) => m.WelcomePage)
        },
        {
          path: 'user-profile/:id',
          loadComponent: () => import('../pages/user-profile/user-profile.page').then( m => m.UserProfilePage),
          canActivate: [authGuard]
        },
        {
          path: 'account-register',
          loadComponent: () => import('../pages/account-register/account-register.page').then( m => m.AccountRegisterPage )
        },
        {
          path: 'login',
          loadComponent: () => import('../pages/login/login.page').then((m) => m.LoginPage)
        },
        {
          path: 'register/:id',
          loadComponent: () => import('../pages/register/register.page').then((m) => m.RegisterPage),
          canActivate: [authGuard]
        },
        {
          path: 'forgot',
          loadComponent: () => import('../pages/forgot/forgot.page').then((m) => m.ForgotPage)
        },
        {
          path: 'verfiy-otp/:id',
          loadComponent: () => import('../pages/verfiy-otp/verfiy-otp.page').then( m => m.VerfiyOtpPage)
        },
        {
          path: 'verfiy-reset-password-otp/:id',
          loadComponent: () => import('../pages/verfiy-reset-password-otp/verfiy-reset-password-otp.page').then( m => m.VerfiyResetPasswordOtpPage)
        },
        {
          path: 'newpassword/:id',
          loadComponent: () => import('../pages/newpassword/newpassword.page').then( m => m.NewpasswordPage)
        },
        {
          path: 'product',
          loadComponent: () => import('../pages/product/product.page').then( m => m.ProductPage),
          canActivate: [authGuard]
        }
        ,
        {
          path: 'unit',
          loadComponent: () => import('../pages/unit/unit.page').then((m) => m.UnitPage),
          canActivate: [authGuard]
        },
        {
          path: 'uom-group',
          loadComponent: () => import('../pages/uom-group/uom-group.page').then( m => m.UomGroupPage),
          canActivate: [authGuard]
        },
        {
          path: 'group',
          loadComponent: () => import('../pages/group/group.page').then( m => m.GroupPage),
          canActivate: [authGuard]
        },
        {
          path: 'group-profile/:id',
          loadComponent: () => import('../pages/group-profile/group-profile.page').then( m => m.GroupProfilePage),
          canActivate: [authGuard]
        }
        ,
        {
          path: 'category',
          loadComponent: () => import('../pages/category/category.page').then( m => m.CategoryPage),
          canActivate: [authGuard]
        },
        {
          path: 'category-profile/:id',
          loadComponent: () => import('../pages/category-profile/category-profile.page').then( m => m.CategoryProfilePage),
          canActivate: [authGuard]
        },
        {
          path: 'product-profile/:id',
          loadComponent: () => import('../pages/product-profile/product-profile.page').then( m => m.ProductProfilePage),
          canActivate: [authGuard]
        }
 
    ]
  }
];