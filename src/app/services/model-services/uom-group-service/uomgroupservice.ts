import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIService } from '../../API/api.service';
import { Observable, delay, switchMap, timer } from 'rxjs';
import { MessageResponse } from '../../interfaces/MessageResponse';


@Injectable({
  providedIn: 'root'
})

export class UnitService {

  private http = inject(HttpClient);

  private API = inject(APIService);

  

}