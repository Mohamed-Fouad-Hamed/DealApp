import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, delay, switchMap, timer } from 'rxjs';
import { MessageResponse } from '../../interfaces/MessageResponse';
import { ICategoryRequest, ICategoryResponse } from 'src/app/interfaces/DB_Models';



@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  private http = inject(HttpClient);

  private API = inject(APIService);

  getCategory(id:string): Observable<ICategoryResponse>{

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<ICategoryResponse>(`${URL}/get-category?id=${id}`)
        })
      );

  }

  categoryExists(id:string){
      
    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<any>(`${URL}/category-name?id=${id}`)
        })
      );
  }

  getCategories(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<any>(`${URL}/get-categories`)
        })
      );
  }

  getCategoriesByAccountType(accountType:string){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<ICategoryResponse[]>(`${URL}/get-categories-by-account-type?accountType=${accountType}`)
        })
      );
  }

  getCategoriesByGroup(group:string){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<ICategoryResponse[]>(`${URL}/get-categories-by-group?group=${group}`)
        })
      );
  }
  
  getCategoriesRowStates(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-categories-row-states`)
        })
      );

  }

  getAcceptedCategories(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-categories-accepted`)
        })
      );
  }

  getPendingCategories(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-categories-pending`)
        })
      );
  }

  getRejectedCategories(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-categories-rejected`)
        })
      );
  }

  uploadCategory(category:ICategoryRequest):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/create-category`, category , this.API.headerJsonType ).pipe(
          delay(100)
      );

  }

  uploadCategoryImage(formData:FormData):Observable<MessageResponse>{
    
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/category-upload-image`, formData ).pipe(
            delay(100)
        );

  }

setCategoryAccepted(formData:FormData){
  
  const URL = this.API.apiHost;
    
  return this.http.post<MessageResponse>(`${URL}/set-category-accepted`, formData ).pipe(
          delay(100)
      );

}

setCategoryRejected(formData:FormData){
  
  const URL = this.API.apiHost;
    
  return this.http.post<MessageResponse>(`${URL}/set-category-rejected`, formData ).pipe(
          delay(100)
      );

}


}
