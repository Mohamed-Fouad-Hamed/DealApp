import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { MessageResponse } from '../services/interfaces/MessageResponse';
import { IAccountResponse, IAccountSignup , ICredential , INewPassword , ISignup , ITokenLogin , IUniqueLogin , IUserResponse, IVerifyOTP } from '../services/interfaces/Auth-Interfaces';
import { APIService } from './API/api.service';
import { BehaviorSubject, timer } from 'rxjs';
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

   getUser(login:string) {
    // debounce
    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<IUserResponse>(`${URL}/user-login?id=${login}`)
        })
      );
  }



  getAccount(id:string) {
    // debounce
    const URL = this.API.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<IAccountResponse>(`${URL}/account-id?id=${id}`)
        })
      );
  }

userRegister(signUp:ISignup):Observable<MessageResponse>{
     
    return this.http.post<MessageResponse>(this.authURL + 'user-register', signUp , httpOptions).pipe(
           delay(100)
      );
 }

 userUploadAvatar(formData:FormData):Observable<MessageResponse>{
  return this.http.post<MessageResponse>(this.authURL + 'upload-user-avatar', formData ).pipe(
         delay(100)
    );
}

userUploadImage(formData:FormData):Observable<MessageResponse>{
  return this.http.post<MessageResponse>(this.authURL + 'upload-user-image', formData ).pipe(
         delay(100)
    );
}

accountUploadLogo(formData:FormData):Observable<MessageResponse>{
  return this.http.post<MessageResponse>(this.authURL + 'upload-account-logo', formData ).pipe(
         delay(100)
    );
}

accountUploadImage(formData:FormData):Observable<MessageResponse>{
  return this.http.post<MessageResponse>(this.authURL + 'upload-account-image', formData ).pipe(
         delay(100)
    );
}

 accountRegister(accountSignUp:IAccountSignup):Observable<MessageResponse>{
     
  return this.http.post<MessageResponse>(this.authURL + 'account-register', accountSignUp , httpOptions).pipe(
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

