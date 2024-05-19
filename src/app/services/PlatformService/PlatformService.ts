import { Injectable, inject } from "@angular/core";
import { Platform } from "@ionic/angular/standalone";

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  platform: Platform = inject(Platform);

  async isPlatform(platforms:any[]) {
    
    let bool:boolean = false;

    this.platform.ready().then((plt) => {
        for(let _p of platforms){
            bool = this.platform.is(_p); 
            if(!bool)
                break;
         }

    });

     return bool;
  }


  setRightToLeft(){
    document.dir = 'rtl';
  }

  
  setLeftToRight(){
    document.dir = 'ltr';
  }

  isRTL(){
    return this.platform.isRTL;
  }

  isLTR(){
    return !this.platform.isRTL;
  }



}