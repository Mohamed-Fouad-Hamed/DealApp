import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APIService } from '../../API/api.service';
import { delay, Observable, switchMap, timer } from 'rxjs';
import { MessageResponse } from '../../interfaces/MessageResponse';
import { IAccountOfferReq, IOfferDetailsReq } from 'src/app/interfaces/DB_Models';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  private http = inject(HttpClient);

  private API = inject(APIService);

  constructor() { }

  getOffer(offerId:string){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/offer-id?id=${offerId}`)
        })
      );
  }

  getOfferByAccountId(accountId:string){
    const URL = this.API.apiHost;
    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-offer-by-account?accountId=${accountId}`)
        })
      );
  }

  
  getOffers(){

    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/offers`)
        })
      );
  }


  uploadOffer(offer:IAccountOfferReq):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/update-offer`, offer , this.API.headerJsonType ).pipe(
          delay(100)
      );

  }

  

  updateOfferDetails(offerDetails:IOfferDetailsReq[]):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/update-offer-details`, offerDetails , this.API.headerJsonType ).pipe(
          delay(100)
      );

  }


  uploadOfferWithImagePath(formData:FormData):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/update-offer-with-image-path`, formData ).pipe(
            delay(100)
        );

  }

  uploadOfferImage(formData:FormData):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/update-offer-image`, formData ).pipe(
            delay(100)
        );

  }

  uploadOfferOccasionImage(formData:FormData):Observable<MessageResponse>{
      
    const URL = this.API.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/update-offer-occasion-image`, formData ).pipe(
            delay(100)
        );

  }



}
