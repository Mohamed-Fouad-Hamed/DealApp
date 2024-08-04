import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MultiSelectionSearchComponent } from 'src/app/modals/multi-selection-search/multi-selection-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';
import { AccountProductItem } from 'src/app/types/types';
import { AccountProductService } from 'src/app/services/model-services/account-product/account-product.service';
import { OfferService } from 'src/app/services/model-services/account-offer/offer.service';
import { IAccountOfferReq, IAccountOfferRes, IOfferDetailsReq } from 'src/app/interfaces/DB_Models';
import {OfferComponent} from 'src/app/components/offer/offer.component';
import { importValues } from 'src/app/utilities/ObjectsOps';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';

@Component({
  selector: 'app-account-offer',
  templateUrl: './account-offer.page.html',
  styleUrls: ['./account-offer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,MultiSelectionSearchComponent,TranslateModule,RouterLink,OfferComponent]
})
export class AccountOfferPage implements OnInit,OnDestroy {

  private route = inject(ActivatedRoute);

  private api = inject(APIService);

  private accountProductService = inject(AccountProductService);

  private offerService = inject(OfferService);

  accountId?:string ;

  products:AccountProductItem[] = [] ;

  filteredProducts:AccountProductItem[] = [] ;

  apiServer?:string;

  offerRes:IAccountOfferRes={

    id : 0 ,

    accountId : 0,

    off_name : '',

    o_date : new Date(),

    startAt :  new Date(),

    endAt :  new Date(),

    o_image : '',

    occasion_image : '',

    is_active : false,
    
    offerDetailsList : []
  };

  accountOfferReq : IAccountOfferReq = {

    id : 0 ,

    accountId : 0 ,

    off_name : '',

    o_date : new Date() ,

    startAt : new Date(),

    endAt : new Date(),

    is_active : false,
    
    offerDetailsList : []
    
  }


  private productsArr?:number[] = [];

  private subscriptionRoute?:Subscription;
  private subscriptionSearch? : Subscription;
  private subscriptionList? : Subscription;
  private subscriptionOfferRes? : Subscription;

  constructor() { }

  ngOnInit() {

    this.initGetAccountId();
    this.initAccountProductsList();
    this.apiServer! = this.api.apiHost;
    this.initOfferRes();

  }

  initGetAccountId(){
    this.subscriptionRoute = this.route.paramMap.subscribe((params)=>{
      this.accountId! = params.get('accountid') || '' ;
    });
  }

  initOfferRes(){

    this.subscriptionOfferRes = this.offerService.getOfferByAccountId(this.accountId!).subscribe({

      next:(res:MessageResponse)=>{ 
        
        const offer = res.entity;

      if(offer){
    
        const  accountOfferReq : IAccountOfferReq = {

            id : offer.id ,
        
            accountId : offer.accountId ,
        
            off_name : offer.off_name,
        
            o_date : offer.o_date ,
        
            startAt : offer.startAt,
        
            endAt : offer.endAt,
        
            is_active : offer.active,
            
            offerDetailsList : offer.offerDetailsList.map((offerDetails:any)=>{ 
              const offerDetailsReq : IOfferDetailsReq ={
              id : offerDetails.id,
              product_id : offerDetails.product_id,
              unit : offerDetails.unit,
              max_quan : offerDetails.max_quan,
              max_limit : offerDetails.max_limit,
              percent_discount : offerDetails.percent_discount,
              price : offerDetails.price,
              o_price : offerDetails.o_price
         }
           return offerDetailsReq;
        })

        }
          this.accountOfferReq = accountOfferReq;
      }    

      }
      , error:(err)=>{console.log('error :' , err)},
      complete:()=>{
        console.log('Complete ...')
      }
    }
  
    );
  }
  
  initAccountProductsList(){
    this.subscriptionList = this.accountProductService.getAccountProducts(this.accountId!)
    .pipe(map((products:any)=> {
                 const _products = products.list.map((_product:any)=>{ 
                   const product:AccountProductItem = {
                   productId: _product.productId,
                   product_name: _product.product_name,
                   product_image: _product.product_image 
                 };
                   return product;
             });
                 return _products;
          })).subscribe((_products:AccountProductItem[]) => {
                          
                          this.products = _products; 

                          this.filteredProducts = [...this.products];

                          this.productsArr! = [...this.products.map(({productId})=>  {return productId} )]
                         
                         })
 }

 ngOnDestroy(): void {
  if(this.subscriptionRoute) this.subscriptionRoute!.unsubscribe();
  if(this.subscriptionList) this.subscriptionList!.unsubscribe();
  if(this.subscriptionSearch) this.subscriptionSearch!.unsubscribe();
  if(this.subscriptionOfferRes) this.subscriptionOfferRes!.unsubscribe();
 }

 updateOfferHeader( offerRes:any ){
    console.log(offerRes);
 }

}
