import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthStorageService {

  TOKEN_KEY:string = '';
  USER_KEY:string = '';
  USER_MENUS:string = '';
  COMPANY_KEY:string = '';
  LANGUAGE_KEY:string = '';

 
   constructor() {
     this.TOKEN_KEY = 'auth-token';
     this.USER_KEY = 'auth-user';
     this.USER_MENUS = 'user-menus';
     this.COMPANY_KEY = 'company-key';
     this.LANGUAGE_KEY = 'language-key';
    }
 
   signOut() {
     window.sessionStorage.clear();
   }
 
   public saveToken(token: string) {
     window.sessionStorage.removeItem(this.TOKEN_KEY);
     window.sessionStorage.setItem(this.TOKEN_KEY, token);
   }
 
   public getToken(): string | null {
     return sessionStorage.getItem(this.TOKEN_KEY) ;
   }
 
   public saveUser(user:any) {
     window.sessionStorage.removeItem(this.USER_KEY);
     window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
   }
 
   public getUser() {
     const user : string | null = sessionStorage.getItem(this.USER_KEY);
     return JSON.parse( user || '');
   }
 
   public saveMenus(menus: any[]) {
     window.sessionStorage.removeItem(this.USER_MENUS);
     window.sessionStorage.setItem(this.USER_MENUS, JSON.stringify(menus));
   }
 
   public getMenus() : any[] {
     const menus : string | null = sessionStorage.getItem(this.USER_MENUS);
     return JSON.parse(menus || '');
   }
 
   public saveCompany(company: any) {
     window.sessionStorage.removeItem(this.COMPANY_KEY);
     window.sessionStorage.setItem(this.COMPANY_KEY, JSON.stringify(company));
   }
 
   public getCompany() : any {
     const company : string | null = sessionStorage.getItem(this.COMPANY_KEY);
     return JSON.parse(company || '' );
   }
 
   public saveLanguage(lang: any) {
     window.sessionStorage.removeItem(this.LANGUAGE_KEY);
     window.sessionStorage.setItem(this.LANGUAGE_KEY, JSON.stringify(lang));
   }
 
   public getLanguage(): any {
     const language : string | null = sessionStorage.getItem(this.LANGUAGE_KEY);
     return JSON.parse(language || '');
   }
 

 
}
