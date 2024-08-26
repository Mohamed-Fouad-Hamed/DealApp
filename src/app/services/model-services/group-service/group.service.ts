import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, delay, switchMap, timer } from 'rxjs';
import { MessageResponse } from '../../interfaces/MessageResponse';
import { IGroupRequest, IGroupResponse } from 'src/app/interfaces/DB_Models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private http = inject(HttpClient);

  private API = inject(APIService);

  getGroup(id:string): Observable<IGroupResponse>{

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<IGroupResponse>(`${URL}/get-group?id=${id}`)
        })
      );

  }

  groupExists(id:string){
      
    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<any>(`${URL}/group-name?id=${id}`)
        })
      );
  }

  getGroups(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<any>(`${URL}/get-groups`)
        })
      );
  }

  getGroupsByAccountType(accountType:string){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<IGroupResponse[]>(`${URL}/get-groups-by-account-type?accountType=${accountType}`)
        })
      );
  }
  
  getGroupsRowStates(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-groups-row-states`)
        })
      );

  }

  getAcceptedGroups(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-groups-accepted`)
        })
      );
  }

  getPendingGroups(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-groups-pending`)
        })
      );
  }

  getRejectedGroups(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-groups-rejected`)
        })
      );
  }

  uploadGroup(group:IGroupRequest):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/create-group`, group , this.API.headerJsonType ).pipe(
          delay(100)
      );

  }

  uploadGroupImage(formData:FormData):Observable<MessageResponse>{
    
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/group-upload-image`, formData ).pipe(
            delay(100)
        );

  }

setGroupAccepted(formData:FormData){
  
  const URL = this.API.apiHost;
    
  return this.http.post<MessageResponse>(`${URL}/set-group-accepted`, formData ).pipe(
          delay(100)
      );

}

setGroupRejected(formData:FormData){
  
  const URL = this.API.apiHost;
    
  return this.http.post<MessageResponse>(`${URL}/set-group-rejected`, formData ).pipe(
          delay(100)
      );

}

}
