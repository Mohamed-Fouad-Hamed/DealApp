
import {  inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';


import {  from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { APIService } from '../API/api.service';
import { AuthenticationService } from '../Auth-services/authentication.service';

export function jwtInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
    // add auth header with jwt if user is logged in and request is to the api url
    console.log(" Authentication Interceptor ... ")
    const authService = inject(AuthenticationService);
    const apiUrl = inject(APIService);
  
    return from(authService.getUserAuth()).pipe(
      switchMap((user)=>{
        const isApiUrl = request.url.startsWith(apiUrl.apiHost);
        if( user?.token.length > 0 && isApiUrl ){
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user?.token}` 
            }});
        }
        return next(request);
    })
  );

  }