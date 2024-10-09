import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { MultiSelectionSearchComponent } from 'src/app/modals/multi-selection-search/multi-selection-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, first } from 'rxjs/operators';  
import { from, map, Subscription } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';
import { AccountProductItem, Item } from 'src/app/types/types';
import { AccountProductService } from 'src/app/services/model-services/account-product/account-product.service';
import { OfferService } from 'src/app/services/model-services/account-offer/offer.service';
import { IAccountOfferReq, IAccountOfferRes, IOfferDetailsRes } from 'src/app/interfaces/DB_Models';
import {OfferComponent} from 'src/app/components/offer/offer.component';
import { OfferDetailsComponent } from 'src/app/components/offer/offer-details/offer-details.component';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';
import { hasChanges } from 'src/app/utilities/ObjectsOps';



@Component({
  selector: 'app-account-offer',
  templateUrl: './account-offer.page.html',
  styleUrls: ['./account-offer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , MultiSelectionSearchComponent,TranslateModule,RouterLink,OfferComponent,OfferDetailsComponent]
})
export class AccountOfferPage implements OnInit,OnDestroy {
 
  @ViewChild('modal') modal!: ModalController;

  private modalCtrl = inject( ModalController);

  private route = inject(ActivatedRoute);

  private api = inject(APIService);

  private productService = inject(ProductService);

  private accountProductService = inject(AccountProductService);

  private offerService = inject(OfferService);

  accountId?:string ;

  items:Item[] = [] ;

  products:AccountProductItem[] = [] ;

  filteredProducts:AccountProductItem[] = [] ;

  apiServer?:string;

  offerRes:  IAccountOfferRes  = {

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

    o_date : new Date().toISOString() ,

    startAt : new Date().toISOString(),

    endAt : new Date().toISOString(),

    is_active : false,
    
   // offerDetailsList : []
    
  }

  currentOfferDetails?:IOfferDetailsRes;

  offerProductCtx = {
    currentOfferProduct : this.currentOfferDetails!
  }

  private productsArr?:number[] = [];

  private subscriptionRoute?:Subscription;
  private subscriptionSearch? : Subscription;
  private subscriptionList? : Subscription;
  private subscriptionOfferRes? : Subscription;
  private subscriptionAccountProduct? : Subscription;
  private subscriptionOfferProduct? : Subscription;
  private imageSubscription? : Subscription;
  private occasionImageSubscription? : Subscription;

  step:number = 0 ;

  imageUrl:string = '';
  occasionUrl:string ='';

  constructor() { }

  ngOnInit() {

    this.initGetAccountId();
    this.apiServer! = this.api.apiHost;
    this.initOfferRes();

  }

  initGetAccountId(){
    this.subscriptionRoute = this.route.paramMap.subscribe((params)=>{
      this.accountId! = params.get('accountId') || '' ;
    });
  }

  initOfferRes(){

    this.subscriptionOfferRes = this.offerService.getOfferByAccountId(this.accountId!).subscribe({

      next:(res:MessageResponse)=>{ 
        
        const offer = res.entity;

      if(offer) {
    
        const  _accountOfferRes : IAccountOfferRes = {

            id : offer.id ,
        
            accountId : offer.accountId ,
        
            off_name : offer.off_name,
        
            o_date :  offer.o_date ,
        
            startAt :  offer.startAt ,
        
            endAt :  offer.endAt ,

            o_image : offer.o_image,

            occasion_image : offer.occasion_image ,
        
            is_active : offer._active ,
            
          offerDetailsList : offer.offerDetailsList.map((offerDetails:any)=>{ 

              const offerDetailsRes : IOfferDetailsRes ={
                  id : offerDetails.id,
                  offer_id : offer.id ,
                  product_id : offerDetails.product_id,
                  product_name : offerDetails.product_name  ,
                  product_image : offerDetails.product_image,
                  unit : offerDetails.unit,
                  max_quan : offerDetails.max_quan,
                  max_limit : offerDetails.max_limit,
                  percent_discount : offerDetails.percent_discount,
                  price : offerDetails.price,
                  o_price : offerDetails.o_price
         }

           return offerDetailsRes;

        })

        }

          this.offerRes = _accountOfferRes;

          this.accountOfferReq  = {

            id : this.offerRes.id ,
        
            accountId : this.offerRes.accountId ,
        
            off_name : this.offerRes.off_name ,
        
            o_date : ''+this.offerRes.o_date ,
        
            startAt : ''+this.offerRes.startAt,
        
            endAt : ''+this.offerRes.endAt,
        
            is_active : this.offerRes.is_active /*,
            
            offerDetailsList : this.offerRes.offerDetailsList.map((details)=>{

              
                const offerDetailsReq : IOfferDetailsReq ={
                  id : details.id,
                  offer_id : offer.id ,
                  product_id : details.product_id,
                  unit : details.unit,
                  max_quan : details.max_quan,
                  max_limit : details.max_limit,
                  percent_discount : details.percent_discount,
                  price : details.price,
                  o_price : details.o_price
              }

              return offerDetailsReq;
                  
            })*/
            
          }
         
         this.products = this.offerRes.offerDetailsList.map((_product)=>{
              const product:AccountProductItem = {
                productId: _product.product_id,
                product_name: _product.product_name  ,
                product_image: _product.product_image 
              };
                return product;
         })

         this.filteredProducts = [...this.products];

         this.productsArr! = [...this.products.map(({productId})=>  {return productId} )]

      }    

      }
      , error:(err)=>{console.log('error :' , err)},
      complete:()=>{
        console.log('Complete ...')
      }
    }
  
    );
  }


 trackItems(index: number, product: AccountProductItem) {
  return product.productId;
}

 ngOnDestroy(): void {
      if(this.subscriptionRoute) this.subscriptionRoute!.unsubscribe();
      if(this.subscriptionList) this.subscriptionList!.unsubscribe();
      if(this.subscriptionSearch) this.subscriptionSearch!.unsubscribe();
      if(this.subscriptionOfferRes) this.subscriptionOfferRes!.unsubscribe();
      if(this.subscriptionAccountProduct) this.subscriptionAccountProduct!.unsubscribe();
      if(this.subscriptionOfferProduct) this.subscriptionOfferProduct!.unsubscribe();
      if(this.imageSubscription) this.imageSubscription!.unsubscribe();
      if(this.occasionImageSubscription) this.occasionImageSubscription.unsubscribe();
 }



 updateOfferHeader( offerRes:any ){

      if(offerRes){
        this.offerRes = offerRes;
      }
      this.step = 1 ;
     
 }

 cancelOfferHeader(){
    this.step = 0 ;
 }

 updateOfferDetails(){
   this.imageUrl =  `${this.apiServer!}${this.offerRes.o_image}` ;
   this.occasionUrl =  `${this.apiServer!}${this.offerRes.occasion_image}` ;
   this.step = 2 ;
 }

searchValueEmit($value:any){
  this.items = [] ;
  if($value === '') return;
  this.subscriptionSearch = this.accountProductService.getAccountProductsByProductName(this.accountId!,$value).pipe(
          map((products:any) => { 
            const _items:Item[] = products.list.map((product:any)=>{
            const isExists = this.productsArr!.includes(product.id);  
            const _product:Item = {
              id:product.id ,
              name:product.name,
              text: product.name + ' ' + product.descr ,
              value: product.id,
              des :product.descr,
              icon :product.product_image,
              exists:isExists
            } ; 
          return _product;
      }); 
          return _items;
     }
    )).subscribe((products) => {
     this.items = products 
     console.log('items : ' , this.items)
    });
}


itemSelected($item:any){
     this.modal.dismiss($item,'confirm');
}

onWillDismiss(event: Event) {
  const ev = event as CustomEvent<OverlayEventDetail<any>>;
  const {role , data } = ev.detail;
  if (role === 'confirm' && data) {

   const _itemsSelected = this.items.filter((item)=>{
      return  (<Array<string>> data).includes(item.value);
    }).map((_product:any)=>{ 
      const product:AccountProductItem = {
      productId: _product.value,
      product_name: _product.text,
      product_image: _product.icon,
      notUpdate:true
    };
      return product;
    });

    this.products = [...this.products,..._itemsSelected];

    this.filteredProducts = [...this.products];

    this.productsArr?.push(...data);
     
     this.items = [];
   
      
  }
}

viewDetail(product:AccountProductItem){

  if(product.notUpdate!){

        this.subscriptionAccountProduct = this.productService.getProduct(''+product.productId).pipe(
          map((res:any) => { 
                const _product = res.entity;
                const _offerProduct:IOfferDetailsRes = {
                  id : 0 ,
                  offer_id : this.offerRes.id,
                  product_id : _product.id ,
                  product_name : _product.name ,
                  product_image  : _product.product_image,
                  unit : _product.first_unit ,
                  max_quan : 0,
                  max_limit : 0,
                  percent_discount : 0,
                  price : _product.first_price,
                  o_price : 0,
                
                }
              return _offerProduct;
          }) 
        ).subscribe((product) => { 
           this.setCurrentOfferProduct(product);
         });

  }
  else

    this.getOfferProduct(product.productId);
 
}

private setCurrentOfferProduct(product:any){
  this.currentOfferDetails!  = product
  this.offerProductCtx = {
    currentOfferProduct : this.currentOfferDetails!
  }
}

getOfferProduct( productId:number  ){
   const source = from(this.offerRes.offerDetailsList);
   const subscribe = source.pipe(first((_product) => _product.product_id === productId));
   subscribe.subscribe((_product)=> {
    this.setCurrentOfferProduct(_product)
  } );
}


offerProductSaved(offerProduct:any){

  const _idxDetails = this.offerRes.offerDetailsList.findIndex(
    (detail)=> detail.product_id === offerProduct.product_id
  );

  if( _idxDetails > -1 ){
    this.offerRes.offerDetailsList.splice(_idxDetails,1,offerProduct);
  }
  else{
    this.offerRes.offerDetailsList.push(offerProduct);
  }

  const _product:AccountProductItem = {
    productId: offerProduct.product_id,
    product_name: offerProduct.product_name  ,
    product_image: offerProduct.product_image 
  };

  const idx = this.products.findIndex(
    (product) => product.productId === offerProduct.product_id
  );
  
  if(idx > -1){
     this.products.splice(idx,1,_product);
  }
  else
     this.products.push(_product);

     this.resetFilterProducts();
}

cancelOfferProductDailog(){

   this.resetFilterProducts();
}

resetFilterProducts(){
  this.filteredProducts = [...this.products];
  this.currentOfferDetails = undefined;
}

searchbarInputAccountProducts(ev:any){
  this.filterList(ev.target.value);
}

/**
 * Update the rendered view with
 * the provided search query. If no
 * query is provided, all data
 * will be rendered.
 */
filterList(searchQuery: string | undefined) {
  /**
   * If no search query is defined,
   * return all options.
   */
  if (searchQuery === undefined) {
    this.filteredProducts = [...this.products];
  } else {
    /**
     * Otherwise, normalize the search
     * query and check to see which items
     * contain the search query as a substring.
     */
    const normalizedQuery = searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter((item) => {
      return item.product_name.toLowerCase().includes(normalizedQuery);
    });
  }
}

/* upload images */

async openModalOccasionImage() {

  const modal = await this.modalCtrl.create({
    component: SelectImageComponent,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    this.occasionUrl = '';
    const formData:FormData = new FormData();
      const fileName = `image-occasion-offer.${data.type.split('\/')[1]}`;
      formData.append('image',data,fileName);
      formData.append('id',''+this.offerRes.id);
      this.imageSubscription = this.offerService.uploadOfferOccasionImage(formData).pipe(finalize(()=>{
        console.log(' finally ... ')
      })).subscribe({
        next:(res:any)=>{
        const offerUploaded = res.entity;
        this.occasionUrl = `${this.apiServer!}${offerUploaded.occasion_image}` 
      },error:(error:any)=>{
        console.log(error)
      },complete:()=>{
        
      }});
  }
}


async openModalImage() {

  const modal = await this.modalCtrl.create({
    component: SelectImageComponent,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (role === 'confirm') {
    this.imageUrl = '';
    const formData:FormData = new FormData();
      const fileName = `image-offer.${data.type.split('\/')[1]}`;
      formData.append('image',data,fileName);
      formData.append('id',''+this.offerRes.id);
      this.imageSubscription = this.offerService.uploadOfferImage(formData).pipe(finalize(()=>{
        console.log(' finally ... ')
      })).subscribe({
        next:(res:any)=>{
        const offerUploaded = res.entity;
        this.imageUrl = `${this.apiServer!}${offerUploaded.o_image}` 
      },error:(error:any)=>{
        console.log(error)
      },complete:()=>{
        
      }});
  }
}

}
