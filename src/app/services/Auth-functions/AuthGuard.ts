import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../Auth-services/authentication.service';



export  function  authGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
   
    const authService = inject(AuthenticationService);

    const router = inject(Router);
    /*
    let isGuard = false

    const userObservable = from(authService.getUserAuth()).subscribe({ next: (user)=> {
        console.log(user)
        if(user?.token.length > 0)
            isGuard = true

    }});

   if(isGuard)
       return isGuard;

    router.navigate(['/login']);
    return false;
*/

    return async()=>{
        
        const userPromise = await authService.getUserPromise();
        if(userPromise?.token.length > 0)
            return true;
        else
        {
            router.navigate(['/login']);
            return false;
        
        }
    }


}