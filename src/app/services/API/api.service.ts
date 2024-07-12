import { Injectable, inject } from "@angular/core";
import { PlatformService } from "../PlatformService/PlatformService";
import { HttpHeaders } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})


export class APIService {

  private platformService = inject(PlatformService);

  private  host:string = ''; 

  constructor(){

  }
  
async initApiService(){
    /*
      this.platform.ready().then((plt) => { 
        
        const isMobilAndroid = this.platform.is('mobile') && this.platform.is('android');
          
        if (isMobilAndroid) {
      
          this.host = '10.0.2.2:8080' ;
      
        } else {
      
          this.host='localhost:8080';
      
        }
      
      });
    */

   const platforms = [];

   platforms.push("mobile");
   platforms.push("android");

   const isMobilAndroid = await this.platformService.isPlatform(platforms);
   
   if (isMobilAndroid) {
      
    this.host = '10.0.2.2:8080' ;

  } else {

    this.host='localhost:8080';

  }

 }

 get AUTH_API():string{
  const url =  `http://${this.host}/`;
  return url ;
}

get apiHost() : string{
   return `http://${this.host}`;
}

get headerJsonType() {
   return httpOptions;
}


}
