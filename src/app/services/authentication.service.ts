import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { MessageResponse } from '../services/interfaces/MessageResponse';
import { ICredential,ILogin,INewPassword,ISignup,ITokenLogin,IUniqueLogin,IVerifyOTP } from '../services/interfaces/Auth-Interfaces';
import { APIService } from './API/api.service';
import { BehaviorSubject } from 'rxjs';
import { IDBUser } from '../interfaces/DB_Models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

 private http = inject(HttpClient);

 private API = inject(APIService);
 
 private authURL:string ='';

 private userInfo = new BehaviorSubject<IDBUser>({ id : 0,login :'',name:'',token:'' });

 private userObservable$:Observable<IDBUser> = this.userInfo.asObservable();

  constructor() {
    this.authURL = this.API.AUTH_API;
   }

   setAuthUser(user :IDBUser){
    this.userInfo.next(user);
   }

   get getAuthUser(): Observable<IDBUser>{
      return this.userObservable$;
   }

   get authUrl():string{
    return this.authURL;
   }

   register(signUp:ISignup):Observable<MessageResponse>{
     
    return this.http.post<MessageResponse>(this.authURL + 'register', signUp , httpOptions).pipe(
           delay(100)
      );
 }

   login(credentail:ICredential):Observable<MessageResponse>{
     
      return this.http.post<MessageResponse>(this.authURL + 'login', credentail , httpOptions).pipe(
             delay(100)
        );
   }

   authByToken(iTokenLogin:ITokenLogin){
    return this.http.post<MessageResponse>(this.authURL + 'authenticate', iTokenLogin , httpOptions).pipe(
      delay(100)
      );
   }

  loginIsExists(login:string){
    const iLogin:IUniqueLogin = {id:login};
    return this.http.post<MessageResponse>(this.authURL + 'login-exists', iLogin , httpOptions).pipe(
      delay(100)
      ); 
   }

  verfiyOTP(iVerfiyOtp:IVerifyOTP):Observable<MessageResponse>{
     
    return this.http.post<MessageResponse>(this.authURL + 'verify-register', iVerfiyOtp , httpOptions).pipe(
           delay(100)
      );

   }

   verfiyOTPResetPassword(iVerfiyOtp:IVerifyOTP):Observable<MessageResponse>{
     
    return this.http.post<MessageResponse>(this.authURL + 'verify-reset-password', iVerfiyOtp , httpOptions).pipe(
           delay(100)
      );

   }


   forgetPassword(iUniqueLogin:IUniqueLogin):Observable<MessageResponse>{
     
      return this.http.post<MessageResponse>(this.authURL + 'forgot', iUniqueLogin , httpOptions).pipe(
            delay(100)
        );

    }

    updatePassword(iNewPassword:INewPassword):Observable<MessageResponse>{
     
      return this.http.post<MessageResponse>(this.authURL + 'update-password', iNewPassword , httpOptions).pipe(
            delay(100)
        );

    }


  

}

