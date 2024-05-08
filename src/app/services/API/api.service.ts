import { Injectable, inject } from "@angular/core";
import { Platform } from "@ionic/angular/standalone";

@Injectable({
  providedIn: 'root'
})
export class APIService {

  platform: Platform = inject(Platform);

  private  host:string = ''; 

  constructor(){

  }
  
 initApiService(){

  this.platform.ready().then((plt) => { 
    
    const isMobilAndroid = this.platform.is('mobile') && this.platform.is('android');
      
    if (isMobilAndroid) {
  
       this.host = '10.0.2.2:8080' ;
  
    } else {
  
       this.host='localhost:8080';
  
    }
  
  });

 
 }

 get AUTH_API():string{
  const url =  'http://'+ this.host +'/';
  return url ;
}

get apiHost() : string{
   return `http://${this.host}`;
}


}
