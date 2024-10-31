import { inject, Injectable } from '@angular/core';
import { switchMap, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { APIService } from '../../API/api.service';
import { IAccountResponse } from '../../interfaces/Auth-Interfaces';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private http = inject(HttpClient);

  private API = inject(APIService);

  constructor() { }

  getAccountsByAccountType(accountType:string,owenId:number[]){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<IAccountResponse[]>(`${URL}/get-accounts-by-account-type-not?accountType=${accountType}&owenId=${owenId}`)
        })
      );
  }




}
