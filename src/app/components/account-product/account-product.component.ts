import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription, finalize } from 'rxjs';
import { IAccountProduct } from 'src/app/interfaces/DB_Models';
import { AccountProductService } from 'src/app/services/model-services/account-product/account-product.service';
import { AccountProductDetail } from 'src/app/types/types';
import { TranslateModule } from '@ngx-translate/core';
import { APIService } from 'src/app/services/API/api.service';
import { OfferDetailsComponent } from '../offer/offer-details/offer-details.component';

@Component({
  selector: 'account-product-form-component',
  templateUrl: './account-product.component.html',
  styleUrls: ['./account-product.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule,TranslateModule,OfferDetailsComponent]
})
export class AccountProductComponent  implements OnInit ,OnDestroy {

  @Input() public Account:string = '';

  @Input() public AccountProduct:AccountProductDetail | undefined;

  @Output() saveEventEmitter = new EventEmitter<AccountProductDetail>();

  @Output() cancelEventEmitter = new EventEmitter<void>();

  @ViewChild('accountProductForm') public accountProductFrm!: NgForm;

  productId? : string;
 
  isLoading : boolean = false ;

  error : string = '';

  imageUrl?:string;

  private subscription? : Subscription;

  
  product : IAccountProduct = {
    accountId : 0,
    productId : 0,
    has_first : false,
    first_price:0,
    has_second:false,
    second_price:0,
  };

constructor(
           private accountProductService: AccountProductService,
           private apiService:APIService,
) { }


  ngOnInit() {

     if(this.AccountProduct){
        this.product.accountId = +this.Account;
        this.product.productId = this.AccountProduct.productId;
        this.product.has_first = this.AccountProduct.has_first!;
        this.product.first_price = this.AccountProduct.first_price!;
        this.product.has_second = this.AccountProduct.has_second!;
        this.product.second_price = this.AccountProduct.second_price!;
        this.imageUrl = `${this.AccountProduct.product_image}`;
     }
   
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription!.unsubscribe();
  } 

  async  onSubmit() {

    if (this.accountProductFrm.invalid) {
      return;
    }
  
    this.isLoading = true;

    try{
   
      this.product.accountId = +this.Account!;
      this.product.productId = this.AccountProduct!.productId;
      
      this.subscription = this.accountProductService.updateAccountProduct(
            this.product
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
         ,error:(err)=>{ this.error = err.message }} 
        );

    }catch( e:any){
      this.error = e.message;
  
    }
  }

cancel(){
    this.cancelEventEmitter.emit();
}




  
}
