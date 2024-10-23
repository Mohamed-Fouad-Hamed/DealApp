import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, delay, switchMap, timer } from 'rxjs';
import { MessageResponse } from '../../interfaces/MessageResponse';
import { IAccountProduct } from 'src/app/interfaces/DB_Models';

@Injectable({
  providedIn: 'root'
})
export class AccountProductService {

  private http = inject(HttpClient);

  private API = inject(APIService);

  constructor() { }

  getAccountProducts(accountId:string){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-account-products?accountId=${accountId}`)
        })
      );
  }

  getProductsAccount(accountId:string){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-products-account?accountId=${accountId}`)
        })
      );
  }

  getAccountProduct(accountId:string,productId:string){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-account-product-res?accountId=${accountId}&productId=${productId}`)
        })
      );
  }

  

  getAccountProductsByProductName(accountId:string,productName:string){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-account-products-by-product-name?accountId=${accountId}&productName=${productName}`)
        })
      );
  }


  updateAccountProduct(product:IAccountProduct):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/create-account-product`, product , this.API.headerJsonType ).pipe(
          delay(100)
      );

  }

  
}
