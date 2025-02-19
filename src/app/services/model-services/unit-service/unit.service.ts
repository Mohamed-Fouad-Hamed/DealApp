import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, delay, switchMap, timer } from 'rxjs';
import { MessageResponse } from '../../interfaces/MessageResponse';
import { IUnitRequest } from 'src/app/interfaces/DB_Models';

@Injectable({
  providedIn: 'root'
})

export class UnitService {

  private http = inject(HttpClient);

  private API = inject(APIService);


  getUnit(id:string){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-unit?id=${id}`)
        })
      );
  }

  getPageableUnitsByNameLikePageable(name:string,pageNumber:number,pageSize:number){

    const URL = this.API.apiHost;
  
    return timer(300)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-units-like-name-pageable?name=${name}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
        })
      ); 
  }

   updateUnit(unit:IUnitRequest):Observable<MessageResponse>{
        
        const URL = this.API.apiHost;
        
        return this.http.post<MessageResponse>(`${URL}/set-save-unit`, unit , this.API.headerJsonType ).pipe(
              delay(100)
        );
  
    }

}