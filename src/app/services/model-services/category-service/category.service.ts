import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { switchMap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  private http = inject(HttpClient);

  private API = inject(APIService);


  constructor() { }

  getCategory(id:string){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<any>(`${URL}/category-name?id=${id}`)
        })
      );

  }


}
