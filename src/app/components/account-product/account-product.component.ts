import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription, finalize } from 'rxjs';
import { IAccountProduct, IAccountProductReq } from 'src/app/interfaces/DB_Models';
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
  imports:[IonicModule, CommonModule, FormsModule,ReactiveFormsModule,TranslateModule,OfferDetailsComponent]
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

  accountProductList : IAccountProductReq[] = [];

constructor(
           private accountProductService: AccountProductService,
           private apiService:APIService,
) { }


  ngOnInit() {

     if(this.AccountProduct){

        this.imageUrl = `${this.AccountProduct.product_image}`;

        this.AccountProduct.uomPriceList?.forEach((product)=>{
             const _accProduct : IAccountProductReq ={
               accountId: +this.Account,
               productId: this.AccountProduct!.productId,
               uom_id: product.uom_id,
               uom_name: product.unit_name,
               base_cost :  product.base_cost ,
               base_price :  product.base_price ,
               reduce_per :  product.reduce_per ,
               cost_price :  product.base_price ,
               price : product.price,
               accountPrice : 0
             };

             this.accountProductList.push(_accProduct);

        });

        this.AccountProduct.uomAccountPriceList?.forEach((product)=>{
             let _accountProduct = this.accountProductList.filter((i)=> i.uom_id === product.uom_id );
             if(_accountProduct.length > 0){
              _accountProduct[0].accountPrice = product.price ;
             }
        });

        console.log(this.accountProductList);

     }
   
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription!.unsubscribe();
  } 

  async  onSubmit() {

    const arrData =  this.accountProductList.filter(i => i.accountPrice !== 0);

    if (this.accountProductFrm.invalid || arrData.length === 0 ) {
      return;
    }
  
    this.isLoading = true;

    try{
      
      this.subscription = this.accountProductService.updateAccountProduct(
           arrData
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
