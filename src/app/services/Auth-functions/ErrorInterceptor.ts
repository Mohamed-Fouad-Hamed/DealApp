import {  inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

import {  from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '../Auth-services/authentication.service';

export function errorInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {

    console.log(" Errors Interceptor ... ")
    const authService = inject(AuthenticationService);
  
    return from(authService.getUserAuth()).pipe(
     
      switchMap((user)=>{
  
        return next(request).pipe(catchError(err => {
          if ([401, 403].includes(err.status) && user) {
              // auto logout if 401 or 403 response returned from api
              authService.logOut();
          }
  
          const error = err.error?.message || err.statusText;
          console.error(err);
          return throwError(() => error);
      }))
    })
  );
  }