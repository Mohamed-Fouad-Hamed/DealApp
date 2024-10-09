import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {  IonRouterLink } from '@ionic/angular/standalone';
import { LANGUAGES, Language } from 'src/app/services/interfaces/Languages';
import {TranslateModule , TranslateService} from '@ngx-translate/core';
import { PlatformService } from '../../services/PlatformService/PlatformService';


@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,IonRouterLink,RouterLink,TranslateModule]
})
export class StartPage implements OnInit {

  private translateService = inject(TranslateService);
  private platform = inject(PlatformService);
  
  appLanguages:Language[] = [];


  constructor() {
    
   }

  ngOnInit() {
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
