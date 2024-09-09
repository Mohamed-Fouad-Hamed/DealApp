import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , IonicSlides , InfiniteScrollCustomEvent } from '@ionic/angular';
import {  IonRouterLink } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MainMenuComponent } from 'src/app/components/main-menu/main-menu.component';
import { GroupService } from 'src/app/services/model-services/group-service/group.service';
import { IGroupResponse } from 'src/app/interfaces/DB_Models';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { IUserResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { map, Subscription } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';
import { MessagePageableResponse } from 'src/app/services/interfaces/MessageResponse';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: ['./main-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule  ,RouterLink,IonRouterLink , TranslateModule , MainMenuComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class MainPagePage implements OnInit ,AfterViewInit,OnDestroy {

  private router = inject(Router);
  private groupService = inject(GroupService);
  private authService = inject(AuthenticationService);
  private apiService = inject(APIService);


 private observableUser? : IUserResponse;

  images?:string[] = [];
  groups?:IGroupResponse[] = [];

  userSubscription?:Subscription;
  groupsSubscription?:Subscription;

  groupsCurrentPage:number = 0;
  groupsPageSize :number = 5;
  countGroups : number = 0;

  titleHomePage:string = 'app_menu.main';
  
  swiperModules = [IonicSlides];
    // swiper
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  constructor() { }

  ngOnDestroy(): void {
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
    if(this.groupsSubscription)
      this.groupsSubscription.unsubscribe();
  }

 async ngAfterViewInit() {
    this.images! = [
      'https://media.istockphoto.com/id/1425993030/photo/european-honey-bees-fly-around-apiary.webp?b=1&s=170667a&w=0&k=20&c=UjrXbrwYQZYMGvAg3x78ysHDrFNWYElKeywRN2rFYJA='
      ,'https://media.istockphoto.com/id/1486359843/photo/api-application-programming-interface-software-development-tool.webp?b=1&s=170667a&w=0&k=20&c=InbS19OIy9qvqhXwR4j99hXXe3MRxkc9lMvo7prTl9A='
      ,'https://media.istockphoto.com/id/1602192573/photo/bee-close-up-on-a-flower.webp?b=1&s=170667a&w=0&k=20&c=NCMEsmReAUYUNfFo_RWeshUSxJqvRuuVfB86KePTa_M='
      ,'https://images.unsplash.com/photo-1710104434504-0261d06fa832?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D'
      ,'https://images.unsplash.com/photo-1709828593321-48973262f23e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D'
      ,'https://images.unsplash.com/photo-1705499438100-fff66a0fce50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D'
    ];
  }

  async ngOnInit() {

   this.initiUser();
  
  }

  initiUser(){

    this.authService.getUserAuth().subscribe((oUser)=>{
      this.observableUser = oUser;
      this.initiGroups(this.observableUser!.account_type);
    });
     
  }

  initiGroups(account_type:string){

    this.groupService.getCountAndPageableGroupsByAccountType(  account_type , this.groupsCurrentPage , this.groupsPageSize    )
        .pipe(map((message:MessagePageableResponse)=>{
           this.countGroups = message.count ;
           const groups = message.list.map((group:any)=> { 
              group.img = `${this.apiService.apiHost}${group.img}` ; 
              return group;
            } );

            return groups;
          }))
        .subscribe((groups)=>{
            this.groups! = groups;

    });

  }
   
  getAnotherGroups(){

    this.groupsCurrentPage++;

    this.groupService.getPageableGroupsByAccountType( this.observableUser!.account_type , this.groupsCurrentPage ,this.groupsPageSize    ) .pipe(map((groups:any)=>{
           
      groups.map((group:any)=> { 
          group.img = `${this.apiService.apiHost}${group.img}` ; 
          return group;
        } );

        return groups;
      }))
    .subscribe((groups)=>{
      
      this.groups!.push(...groups);

    });

  }

  onIonInfinite(ev:any) {
    const noMoreDataToFetch = (this.groups!.length == this.countGroups);

    if(noMoreDataToFetch)
      (ev as InfiniteScrollCustomEvent).target.disabled = true;
    else{
      this.getAnotherGroups();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 1000);

    }
      
   
  }

  onSlideChange(e:any){
    console.log('change : ' , e);
  }

  goNext(){
    this.swiperRef?.nativeElement.swiper.slideNext();
  }

  goPrev(){
    this.swiperRef?.nativeElement.swiper.slidePrev();
  }

  navigateTo(url:string){
    this.router.navigate([url]);
  }
}
