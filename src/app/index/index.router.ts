import { Routes } from '@angular/router';
import { IndexPage } from './index.page';

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
          path: 'account-profile/:id',
          loadComponent: () => import('../pages/account-profile/account-profile.page').then( m => m.AccountProfilePage)
        },
        {
          path: 'user-profile/:id',
          loadComponent: () => import('../pages/user-profile/user-profile.page').then( m => m.UserProfilePage)
        },
        {
          path: 'account-register',
          loadComponent: () => import('../pages/account-register/account-register.page').then( m => m.AccountRegisterPage)
        },
        {
            path: 'login',
            loadComponent: () => import('../pages/login/login.page').then((m) => m.LoginPage)
        },
        {
            path: 'register/:id',
            loadComponent: () => import('../pages/register/register.page').then((m) => m.RegisterPage)
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
        }

    ]
  }
];