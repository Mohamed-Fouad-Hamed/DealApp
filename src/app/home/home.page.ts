import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {  IonRouterLink } from '@ionic/angular/standalone';
import { AuthenticationService } from '../services/authentication.service';
import { IDBUser } from '../interfaces/DB_Models';
import { LANGUAGES, Language } from '../services/interfaces/Languages';
import {TranslateModule , TranslateService} from '@ngx-translate/core';
import { PlatformService } from '../services/PlatformService/PlatformService';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,IonRouterLink,RouterLink,TranslateModule]
})

export class HomePage implements OnInit {

  private authService = inject(AuthenticationService);
  private translateService = inject(TranslateService);
  private platform = inject(PlatformService);

   user : IDBUser = { id : 0,login :'',name:'',token:'' } ;

   titleHomePage:string = 'Notification'

   appLanguages:Language[] = [];

  constructor() { }

  ngOnInit() {
    this.authService.getAuthUser.subscribe((user)=>{
      this.user = user
    });

    this.appLanguages = LANGUAGES;
    this.translateService.setDefaultLang('ar');
    this.platform.setRightToLeft();
  }

  onLanguageChange(event:any){
     this.translateService.use( event.target.value ? event.target.value : 'ar');
     if (event.target.value === 'ar')
        this.platform.setRightToLeft();
      else
        this.platform.setLeftToRight();
  }

}
