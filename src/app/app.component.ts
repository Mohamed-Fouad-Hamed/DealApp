import { Component ,inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import { 
   cog,
   send,
   notifications,
   arrowBack,
   arrowForward,
   eye, eyeOff,camera,
   trashOutline,
   createOutline
  } from 'ionicons/icons';
import { DatabaseService } from './services/database.service';
import { PreviousRouteService } from './services/Navigation/PreviousRouteService';
import { APIService } from './services/API/api.service';
import { TranslateService } from '@ngx-translate/core';



register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private databaseService = inject(DatabaseService);
  private previousRouteService = inject(PreviousRouteService);
  private apiService = inject(APIService);
  private translateService = inject(TranslateService);

  constructor() {

    addIcons({ cog , send , notifications , arrowBack , arrowForward ,eye , eyeOff ,camera ,trashOutline,createOutline });

    this.initApiService();
    
    this.initDatabase();

    this.initUrlService();

    this.initMultiLanguage();

  }

  async initMultiLanguage(){
    this.translateService.setDefaultLang('ar');
    this.translateService.addLangs(['ar','en']);
  }

  async initDatabase(){
    this.databaseService.initialzPlugin();
  }

 async initUrlService(){
    this.previousRouteService.init();
  }

  async initApiService(){
    this.apiService.initApiService();
  }
}

