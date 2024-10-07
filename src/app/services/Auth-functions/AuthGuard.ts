import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../Auth-services/authentication.service';
import { inject } from '@angular/core';


export function authGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const authService = inject(AuthenticationService);
    const router = inject(Router);
    
    if(!authService.getAuthenticate){
        router.navigate(['/'])
        return false;
    }

    return true;
}
