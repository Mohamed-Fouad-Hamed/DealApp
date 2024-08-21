import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IAccountOfferReq, IOfferDetailsReq, IOfferDetailsRes } from 'src/app/interfaces/DB_Models';
import { OfferService } from 'src/app/services/model-services/account-offer/offer.service';
import { finalize, Subscription } from 'rxjs';


@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class OfferDetailsComponent  implements OnInit , OnDestroy{

  displayMode : Signal<number> = input.required<number>(); // 0 means component view only

  offerDetailsInput : Signal<IOfferDetailsRes> = input.required<IOfferDetailsRes>(); // offer details inputs

  offerIdInput  : Signal<number> = input.required<number>(); // Offer Id

  private offerDetailsService = inject(OfferService);

  @ViewChild('accountOfferForm') public accountOfferFrm!: NgForm;

  isLoading : boolean = false ;

  error : string = '';

  offerDetails : IOfferDetailsReq = {
     id : 0 ,
     offer_id : 0 ,
     product_id : 0 ,
     unit : '',
     max_quan : 0,
     max_limit : 0,
     percent_discount : 0 ,
     price : 0,
     o_price : 0  
  };

  private subscription? : Subscription;
  
  constructor() { 

    effect(()=>{
       if(this.offerDetailsInput()){
          this.offerDetails.id =  this.offerDetailsInput().id;
          this.offerDetails.offer_id = this.offerIdInput().valueOf();
          this.offerDetails.product_id = this.offerDetailsInput().product_id ;
          this.offerDetails.unit = this.offerDetailsInput().unit ;
          this.offerDetails.price = this.offerDetailsInput().price ;
       }
    });
  }

  ngOnDestroy(): void {
   this.subscription?.unsubscribe();
  }

  ngOnInit(): void {}


  async  onSubmit() {

    if (this.accountOfferFrm.invalid) {
      return;
    }
    this.isLoading = true;

    try{
   
    
      
      this.subscription = this.offerDetailsService.updateOfferDetails(
            this.offerDetails
        ).pipe( finalize(() => {
                setInterval(
                  ()=>{
                    this.isLoading=false;
                  }
                  ,500
                );
        }) )
        .subscribe({ next: (res) => {
         
          if(res.status === 200){
            
              // this.saveEventEmitter.emit(res.entity);
           }
          
         }
         ,error:(err:any)=>{ this.error = err.message }} 
        );

    }catch( e:any){
      this.error = e.message;
  
    }

  }

}
