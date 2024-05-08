import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { UrlService } from './UrlService';

@Injectable({ providedIn: 'root'})
export class PreviousRouteService {

  private previousUrl?: string;
  private currentUrl?: string;
  
  private router = inject(Router);
  private urlService = inject(UrlService);


  constructor() {
  }

  init(){
    this.currentUrl = this.router.url;
    this.router.events.pipe( filter((event:any) => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        this.urlService.setPreviousUrl(this.previousUrl!);
      }
     );
  }
 
}