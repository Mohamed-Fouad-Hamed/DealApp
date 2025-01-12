import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { IProductRequest } from 'src/app/interfaces/DB_Models';
import { MessagePageableResponse, MessageResponse } from '../../interfaces/MessageResponse';
import { IAccountResponse } from '../../interfaces/Auth-Interfaces';


@Injectable({
  providedIn: 'root'
})

export class ProductService {

  private http = inject(HttpClient);

  private API = inject(APIService);
  

  getFactoryAccountsByAccountType(accountType:string){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<IAccountResponse[]>(`${URL}/get-factory-accounts-by-account-type?accountType=${accountType}`)
        })
      );
  }
  
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

      getProductOffer(accountId:string,productId:string){

        const URL = this.API.apiHost;

        return timer(100)
          .pipe(
            switchMap(() => {
              return this.http.get<MessageResponse>(`${URL}/get-product-offer?accountId=${accountId}&productId=${productId}`)
            })
          );
      }

      getAccoutProduct(accountId:string,productId:string){

        const URL = this.API.apiHost;

        return timer(100)
          .pipe(
            switchMap(() => {
              return this.http.get<MessageResponse>(`${URL}/get-account-product?accountId=${accountId}&productId=${productId}`)
            })
          );
      }

      getProductsByName(name:string){

        const URL = this.API.apiHost;

        return timer(100)
          .pipe(
            switchMap(() => {
              return this.http.get<MessageResponse>(`${URL}/get-products-like-name?name=${name}`)
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

    

    getCountAndPageableProductsByGroupId(groupId:string,pageNumber:number,pageSize:number){

      const URL = this.API.apiHost;
  
      return timer(300)
        .pipe(
          switchMap(() => {
            return this.http.get<MessagePageableResponse>(`${URL}/get-count-pageable-products-by-group?groupId=${groupId}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
          })
      );
    }

    
  getPageableProductsByGroupId(groupId:string,pageNumber:number,pageSize:number){

    const URL = this.API.apiHost;

    return timer(300)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-pageable-products-by-group?groupId=${groupId}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
        })
      );
  }


  getCountAndPageableProductsByCategoryId(categoryId:string,pageNumber:number,pageSize:number){

    const URL = this.API.apiHost;

    return timer(300)
      .pipe(
        switchMap(() => {
          return this.http.get<MessagePageableResponse>(`${URL}/get-count-pageable-products-by-category?categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
        })
    );
  }

  
getPageableProductsByCategoryId(categoryId:string,pageNumber:number,pageSize:number){

  const URL = this.API.apiHost;

  return timer(300)
    .pipe(
      switchMap(() => {
        return this.http.get<MessageResponse>(`${URL}/get-pageable-products-by-category?categoryId=${categoryId}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
      })
    );
}

getPageableProductsByNameLikePageable(name:string,pageNumber:number,pageSize:number){

  const URL = this.API.apiHost;

  return timer(300)
    .pipe(
      switchMap(() => {
        return this.http.get<MessageResponse>(`${URL}/get-products-like-name-pageable?name=${name}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
      })
    ); 
}

  uploadProduct(product:IProductRequest):Observable<MessageResponse>{
      
      const URL = this.API.apiHost;
      
      return this.http.post<MessageResponse>(`${URL}/create-product`, product , this.API.headerJsonType ).pipe(
            delay(100)
        );

    }

    uploadProductImage(formData:FormData):Observable<MessageResponse>{
      
      const URL = this.API.apiHost;
      
      return this.http.post<MessageResponse>(`${URL}/product-upload-image`, formData ).pipe(
              delay(100)
          );

    }

    uploadProductImageToListImages(formData:FormData):Observable<MessageResponse>{
      
            const URL = this.API.apiHost;
            
            return this.http.post<MessageResponse>(`${URL}/product-upload-to-list-images`, formData ).pipe(
                    delay(100)
                );
  
    }

    setProductAccepted(formData:FormData){
  
      const URL = this.API.apiHost;
        
      return this.http.post<MessageResponse>(`${URL}/set-product-accepted`, formData ).pipe(
              delay(100)
          );
    
    }
    
    setProductRejected(formData:FormData){
      
      const URL = this.API.apiHost;
        
      return this.http.post<MessageResponse>(`${URL}/set-product-rejected`, formData ).pipe(
              delay(100)
          );
    
    }

}
