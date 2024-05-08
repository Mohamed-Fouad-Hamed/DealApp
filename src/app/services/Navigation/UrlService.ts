import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class UrlService {
  
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private previousUrl$: Observable<string> = this.previousUrl.asObservable();

  constructor() { }

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }

  public getPreviousUrl(): string {
    let _perUrl = '';
    this.previousUrl$.subscribe((perUrl)=>{
        _perUrl = perUrl;
    })
    return _perUrl;
  }    
}