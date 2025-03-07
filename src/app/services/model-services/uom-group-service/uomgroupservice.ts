import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, delay, switchMap, timer } from 'rxjs';
import { MessageResponse } from '../../interfaces/MessageResponse';
import { IUomGroupRequest } from 'src/app/interfaces/DB_Models';


@Injectable({
  providedIn: 'root'
})

export class UomGroupService {

  private http = inject(HttpClient);

  private API = inject(APIService);

  getUnits(){
  
    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-units`)
        })
      );
  }

  getUomGroup(id:string){
  
      const URL = this.API.apiHost;
  
      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-uom-group?id=${id}`)
          })
        );
    }

    getAllUomGroup(){
  
      const URL = this.API.apiHost;
  
      return timer(100)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-all-uom-group`)
          })
        );
    }
  
    getPageableUomGroupsByNameLikePageable(name:string,pageNumber:number,pageSize:number){
  
      const URL = this.API.apiHost;
    
      return timer(300)
        .pipe(
          switchMap(() => {
            return this.http.get<MessageResponse>(`${URL}/get-uom-groups-like-name-pageable?name=${name}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
          })
        ); 
    }
  
     updateUomGroup(uomgroup:IUomGroupRequest):Observable<MessageResponse>{
          
          const URL = this.API.apiHost;
          
          return this.http.post<MessageResponse>(`${URL}/set-save-uom-group`, uomgroup , this.API.headerJsonType ).pipe(
                delay(100)
          );
    
      }



}