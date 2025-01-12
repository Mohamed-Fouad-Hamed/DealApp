import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnDestroy, OnInit, Output, Signal, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IAccountOfferReq, IOfferDetailsReq, IOfferDetailsRes, IProductOffer } from 'src/app/interfaces/DB_Models';
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

  offerDetailsInput  = input.required<IProductOffer>(); // offer details inputs

  @Output() saveEventEmitter = new EventEmitter<IProductOffer>();

  @Output() cancelEventEmitter = new EventEmitter<void>();

  private offerDetailsService = inject(OfferService);

  private apiServer = inject(APIService);

  @ViewChild('accountOfferForm') public accountOfferFrm!: NgForm;

  productImage?:string;

  isLoading : boolean = false ;

  error : string = '';

  offerDetails : IOfferDetailsReq[] = [];

  private subscription? : Subscription;
  
  constructor() { 
  }

  ngOnDestroy(): void {
    if(this.subscription)
       this.subscription?.unsubscribe();
  }

  ngOnInit(): void {          
    this.productImage = this.offerDetailsInput().product_image  && this.offerDetailsInput().product_image !== '' ? 
                        `${this.apiServer}${this.offerDetailsInput().product_image}` : '../../../assets/images/no-image.jpg';  ;
  }


  async  onSubmit() {

    if (this.accountOfferFrm.invalid) {
      return;
    }

    this.isLoading = true;

    try{
   
      for(const product of this.offerDetailsInput().details){
          const detail:IOfferDetailsReq ={
            id: product.id,
            offer_id: this.offerDetailsInput().offer_id,
            product_id: this.offerDetailsInput().product_id,
            unit_id: product.unit_id,
            max_quan: product.max_quan,
            max_limit: product.max_limit,
            percent_discount: product.percent_discount,
            price: product.price,
            o_price: product.o_price
          }
          this.offerDetails.push(detail);
      }
      
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

  offerPriceFocusEevent($index:number){
    try{
   
      let detail = this.offerDetailsInput().details[$index];
      if(detail.percent_discount > 0){
          const discountPrice = detail.price * (detail.percent_discount / 100);
          const offerPrice = detail.price - discountPrice;
          detail.o_price = +offerPrice.toFixed(2);
      }

    }catch(err:any){
        console.log(err);
    }  
  }

}
