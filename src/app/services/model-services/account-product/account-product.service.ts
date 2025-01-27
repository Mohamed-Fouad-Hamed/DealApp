import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, delay, switchMap, timer } from 'rxjs';
import { MessagePageableResponse, MessageResponse } from '../../interfaces/MessageResponse';
import { IAccountProduct, IAccountProductReq } from 'src/app/interfaces/DB_Models';

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

  getAccountProductsIds(accountId:string){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-account-products-ids?accountId=${accountId}`)
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

  getProductsOfferAccount(accountId:string){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-products-offer-account?accountId=${accountId}`)
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

  getProductsAccountPageable(accountId:string,pageNumber:number,pageSize:number){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessagePageableResponse>(`${URL}/get-products-account-pageable?accountId=${accountId}&&pageNumber=${pageNumber}&pageSize=${pageSize}`)
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

  getPageableProductsAccountByNameLike(accountId:string,name:string,pageNumber:number,pageSize:number){

    const URL = this.API.apiHost;
  
    return timer(300)
      .pipe(
        switchMap(() => {
          return this.http.get<MessagePageableResponse>(`${URL}/get-products-account-like-name-pageable?accountId=${accountId}&name=${name}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
        })
      );
      
  }


  updateAccountProduct(product:IAccountProductReq[]):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/create-account-product`, product , this.API.headerJsonType ).pipe(
          delay(100)
      );

  }

  
}
