import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IAccountOfferRes } from 'src/app/interfaces/DB_Models';
import { OfferService } from 'src/app/services/model-services/account-offer/offer.service';
import { APIService } from 'src/app/services/API/api.service';
import { map, Subscription } from 'rxjs';
import { OfferViewComponent } from 'src/app/components/offer-view/offer-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-suppliers-page',
  templateUrl: './offer-suppliers-page.page.html',
  styleUrls: ['./offer-suppliers-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,TranslateModule, OfferViewComponent]
})
export class OfferSuppliersPagePage implements OnInit {

   private apiService = inject(APIService);

   private router = inject(Router);
 
   offerService = inject(OfferService);
 
   offers? : IAccountOfferRes[] ;
 
   subscription! : Subscription ;

   private authenService = inject(AuthenticationService);
  
   subscriptionAuth! : Subscription; 

   private _accountId : number = 0 ;

   constructor() { }
 
 
   ngOnDestroy(): void {
     if(this.subscription)
        this.subscription.unsubscribe();
     if(this.subscriptionAuth)
      this.subscriptionAuth.unsubscribe();  
   }
 
   async ngOnInit() {

      this.subscriptionAuth = 
                        this.authenService
                        .getUserObservable
                        .subscribe((oUser)=>{

          const {account_type} = oUser ;
          const { account_id } = oUser ;


        this.subscription = this.offerService.getOffersByType(account_type,account_id)
                                             .pipe(map((msg:any)=>{

                                                   const _offers = msg.list.map((offer:any)=> {
                                                      const _offer = offer as IAccountOfferRes ;
                                                      _offer.accountImage = this.apiService.getResourcePath(_offer.accountImage!);
                                                      _offer.o_image = this.apiService.getResourcePath(_offer.o_image!);
                                                      _offer.occasion_image = this.apiService.getResourcePath(_offer.occasion_image!);
                                                      return _offer;
                                                   });
                                                   return _offers;

                                             }))
                                             .subscribe((offers:any)=>
                                              {
                                                this.offers! = offers;

                                              });
              
        });   


      
   }


   offerAccountClicked(accountId:number){
      const url = `${'home\/products-by-account\/'+accountId+'\/offers'}`;
      this.router.navigateByUrl(url);
   }
 

}
