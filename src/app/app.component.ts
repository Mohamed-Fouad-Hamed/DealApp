import { Component ,inject, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import { 
  homeOutline,
  cartOutline,
  cashOutline,
   cog,
   send,
   notifications,
   arrowBack,
   arrowForward,
   eye, eyeOff,camera,
   trashOutline,
   createOutline,
   closeCircle,
   checkmarkCircleOutline,
   warningOutline
  } from 'ionicons/icons';
import { DatabaseService } from './services/Database-services/database.service';
import { PreviousRouteService } from './services/Navigation/PreviousRouteService';
import { APIService } from './services/API/api.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthStorageService } from './services/Auth-services/auth-storage.service';

import { IonicModule , MenuController , NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import  basicMenus  from '../assets/menus/basicMenus.json';
import { AccordionComponent } from '../app/components/accordion/accordion.component';
import { AuthenticationService } from './services/Auth-services/authentication.service';
import { IUserResponse } from './services/interfaces/Auth-Interfaces';
import { Subscription } from 'rxjs';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, IonRouterOutlet,AccordionComponent],
})
export class AppComponent implements OnInit , OnDestroy{

  private databaseService = inject(DatabaseService);
  private previousRouteService = inject(PreviousRouteService);
  private apiService = inject(APIService);
  private translateService = inject(TranslateService);
  private authenStorageService = inject(AuthStorageService);
  private authenService = inject(AuthenticationService);

  private router = inject(Router);
  private menuCtrl = inject(MenuController);
  private navCtrl = inject(NavController);
 
  authenticate:boolean=false;

  currentAccountUrl? : string ;
  productListUrl? : string ;
  offerListUrl? : string ;

  subscriptionAuth! : Subscription; 

  user : IUserResponse = 
   { 
    id : 0,
    firstName:'',
    lastName:'',
    email:'',
    login:'',
    s_cut:'',
    token:'',
    user_avatar:'',
    user_image:'',
    isOtpRequired: false,
    account_id: 0,
    account_name:'',
    account_logo:'',
    account_image:'',
    account_type:'' 
  } ;

  bMenus = basicMenus ;

  constructor() {

    addIcons({
      homeOutline,
      cartOutline,
      cashOutline,
      cog ,
      send ,
      notifications ,
      arrowBack ,
      arrowForward ,
      eye ,
      eyeOff ,
      camera ,
      trashOutline,
      createOutline,
      closeCircle,
      checkmarkCircleOutline,
      warningOutline
     });

    this.initApiService();
    
    this.initDatabase();

    this.initAuthStorageService();

    this.initUrlService();

    this.initMultiLanguage();

  }
  
  ngOnDestroy(): void {
   if(this.subscriptionAuth)
      this.subscriptionAuth.unsubscribe();
  }
  
  async ngOnInit() {
    
  this.subscriptionAuth = this.authenService
                              .getUserObservable
                              .subscribe((oUser)=>{
       this.user = oUser;
       this.authenticate = this.user.account_id !== 0;
       this.authenService.setAuthentication(this.authenticate) ;
       this.currentAccountUrl! = `${'home\/account-profile\/'+this.user.account_id}`;
       this.productListUrl! =`${'home\/account-product-list\/'+this.user.account_id}`;
       this.offerListUrl! =`${'home\/account-offer\/'+this.user.account_id}`;
       }
    );
     console.log(" initi APP ...")
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

  async initAuthStorageService(){
    await this.authenStorageService.init();
  }

  async navigateToUrl(path:string){
   /* if(path.includes(':') && this.user.account_id === 0 ){
      this.authenStorageService.getUser().then((solve)=>{
        this.user = solve;
        const { account_id } = this.user;
        path = path.replace(':accountId',''+account_id);
         this.navigate(path);
      })
    } else */ if(path.includes(':') ){
      const { account_id } = this.user;
      path = path.replace(':accountId',''+account_id);
       this.navigate(path);
    }
    else{
        this.navigate(path);
    }

   
  }
 
  private async navigate(path:string){
  //  const encode = encodeURIComponent(path);
    this.navCtrl.setDirection('root');
    this.router.navigateByUrl(path);
    this.menuCtrl.toggle();
  }

  logOut(){
    this.authenService.logOut();
    this.router.navigate(['/']);
  }
}

