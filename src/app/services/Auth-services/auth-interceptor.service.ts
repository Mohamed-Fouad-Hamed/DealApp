import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthStorageService } from './auth-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  private storageService = inject(AuthStorageService);
 
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.storageService.getToken()}` 
      }
    });

    return next.handle(modifiedReq);
  }
}
