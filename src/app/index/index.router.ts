import { Routes } from '@angular/router';
import { IndexPage } from './index.page';

export const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    children:[
       /* {
            path: '',
            loadComponent: () => import('../pages/welcome/welcome.page').then((m) => m.WelcomePage)
        }*/
        {
          path: '',
          loadComponent: () => import('../pages/account-register/account-register.page').then( m => m.AccountRegisterPage)
        },
        {
            path: 'login',
            loadComponent: () => import('../pages/login/login.page').then((m) => m.LoginPage)
        },
        {
            path: 'register',
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
          path: 'newpassword/:id',
          loadComponent: () => import('../pages/newpassword/newpassword.page').then( m => m.NewpasswordPage)
        }

    ]
  }
];