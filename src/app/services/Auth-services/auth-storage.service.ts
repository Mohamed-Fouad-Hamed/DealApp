import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})

export class AuthStorageService {

 private storage$: Storage | null = null;


  TOKEN_KEY:string = '';
  USER_KEY:string = '';
  USER_MENUS:string = '';
  COMPANY_KEY:string = '';
  LANGUAGE_KEY:string = '';
 
 
   constructor(private storage:Storage) {
     this.TOKEN_KEY = 'auth-token';
     this.USER_KEY = 'auth-user';
     this.USER_MENUS = 'user-menus';
     this.COMPANY_KEY = 'company-key';
     this.LANGUAGE_KEY = 'language-key';
    }

    async init(){
      const storage = await this.storage.create();
      this.storage$ = storage ;
    }

    async set(key:string,value:any){
      const valueOfKey = await this.storage$?.set(key,value);
    }

    async get(key:string){
      const valueOfKey = await this.storage$?.get(key);
      return valueOfKey;
    }

    async remove(key:string){
      let valueOfKey = await this.storage$?.remove(key);
    }

    async clear(){
      let result = this.storage$?.clear();
    }

    async keys(){
      let result = this.storage$?.keys();
      return result;
    }
 
   async signOut() {
     await this.clear();
   }
 
   public async saveToken(token: string) {
     await this.set(this.TOKEN_KEY, token);
   }
 
   public async getToken() {
     const token = await this.get(this.TOKEN_KEY);
     return token;
   }
 
   public async  saveUser(user:any) {
     const authUser = await  this.set(this.USER_KEY, JSON.stringify(user));
   }
 
   public async getUser(){
    const user = await this.get(this.USER_KEY);
    return user ? JSON.parse(user) : null;
   }
 
   public async saveMenus(menus: any[]) {
    await this.set(this.USER_MENUS, JSON.stringify(menus));
   }
 
   public async getMenus()  {
     const menus = await this.get(this.USER_MENUS);
     return JSON.parse(menus || '');
   }
 
   public async saveCompany(company: any) {
    await this.set(this.COMPANY_KEY, JSON.stringify(company));
   }
 
   public async getCompany()  {
     const company = await this.get(this.COMPANY_KEY);
     return JSON.parse(company || '' );
   }
 
   public async saveLanguage(lang: any) {
     await this.set(this.LANGUAGE_KEY, JSON.stringify(lang));
   }
 
   public async getLanguage(){
     const language = await this.get(this.LANGUAGE_KEY);
     return JSON.parse(language || '');
   }
}
