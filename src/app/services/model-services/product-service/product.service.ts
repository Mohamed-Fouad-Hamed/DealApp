import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  constructor() { }

  
  getProduct(id:string){
    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<any>(`${URL}/product-name?id=${id}`)
        })
      );
  }
   

}
