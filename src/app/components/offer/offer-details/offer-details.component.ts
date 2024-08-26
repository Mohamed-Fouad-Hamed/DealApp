import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, inject, input, OnDestroy, OnInit, Output, Signal, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IAccountOfferReq, IOfferDetailsReq, IOfferDetailsRes } from 'src/app/interfaces/DB_Models';
import { OfferService } from 'src/app/services/model-services/account-offer/offer.service';
import { finalize, Subscription } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';


@Component({
  selector: 'offer-details-form-component',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class OfferDetailsComponent  implements OnInit , OnDestroy{

  displayMode = input(0); // 0 means component view only

  offerDetailsInput  = input.required<IOfferDetailsRes>(); // offer details inputs

  @Output() saveEventEmitter = new EventEmitter<IOfferDetailsRes>();

  @Output() cancelEventEmitter = new EventEmitter<void>();

  private offerDetailsService = inject(OfferService);

  private api = inject(APIService);

  @ViewChild('accountOfferForm') public accountOfferFrm!: NgForm;

  productImage?:string;

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
          this.offerDetails.offer_id =  this.offerDetailsInput().offer_id;
          this.offerDetails.product_id = this.offerDetailsInput().product_id ;
          this.offerDetails.unit = this.offerDetailsInput().unit ;
          this.offerDetails.price = this.offerDetailsInput().price ;
          this.offerDetails.max_quan = this.offerDetailsInput().max_quan;
          this.offerDetails.max_limit = this.offerDetailsInput().max_limit;
          this.offerDetails.percent_discount = this.offerDetailsInput().percent_discount;
          this.offerDetails.o_price = this.offerDetailsInput().o_price;
          this.productImage = this.api.apiHost + this.offerDetailsInput().product_image ;
       }
    });
  }

  ngOnDestroy(): void {
   this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
  }


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
            
               this.saveEventEmitter.emit(res.entity);
           }
          
         }
         ,error:(err:any)=>{
           this.error = err.message
         }} 
        );

    }catch( e:any){
      this.error = e.message;
  
    }

  }

  cancel(){
    this.cancelEventEmitter.emit();
  }

  offerPriceFocusEevent($event:any){
   const discountPrice = this.offerDetails.price * (this.offerDetails.percent_discount / 100);
   const offerPrice = this.offerDetails.price - discountPrice;
   this.offerDetails.o_price = +offerPrice.toFixed(2);
  }

}
