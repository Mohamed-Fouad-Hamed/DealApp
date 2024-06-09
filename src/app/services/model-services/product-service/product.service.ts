import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { IProductRequest } from 'src/app/interfaces/DB_Models';
import { MessageResponse } from '../../interfaces/MessageResponse';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  private API = inject(APIService);
  
  productExists(id:string){
      
      const URL = this.API.apiHost;

      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<any>(`${URL}/product-name?id=${id}`)
          })
        );
    }

  getProduct(id:string){

      const URL = this.API.apiHost;

      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-product?id=${id}`)
          })
        );
    }

   getProducts(){

      const URL = this.API.apiHost;

      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-products`)
          })
        );
    }

    getProductRowStates(){

      const URL = this.API.apiHost;

      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-products-row-states`)
          })
        );

    }


    getAcceptedProducts(){

      const URL = this.API.apiHost;

      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-products-accepted`)
          })
        );
    }

    getPendingProducts(){

      const URL = this.API.apiHost;

      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-products-pending`)
          })
        );
    }

    getRejectedProducts(){

      const URL = this.API.apiHost;

      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-products-rejected`)
          })
        );
    }

    getProductsByCategory(id:string){

        const URL = this.API.apiHost;

        return timer(100)
          .pipe(
            switchMap(() => {
              return this.http.get<MessageResponse>(`${URL}/get-products-by-category?id=${id}`)
            })
          );
      }

    uploadProduct(product:IProductRequest):Observable<MessageResponse>{
      
      const URL = this.API.apiHost;
      
      return this.http.post<MessageResponse>(`${URL}/create-product`, product , httpOptions ).pipe(
            delay(100)
        );

    }

    uploadProductImage(formData:FormData):Observable<MessageResponse>{
      
      const URL = this.API.apiHost;
      
      return this.http.post<MessageResponse>(`${URL}/upload-product-image`, formData ).pipe(
              delay(100)
          );

      }

      uploadProductImageToListImages(formData:FormData):Observable<MessageResponse>{
      
            const URL = this.API.apiHost;
            
            return this.http.post<MessageResponse>(`${URL}/product-upload-to-list-images`, formData ).pipe(
                    delay(100)
                );
  
        }

  

   




}
