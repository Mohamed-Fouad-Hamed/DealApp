import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController , LoadingController } from '@ionic/angular';
import { InfiniteScrollCustomEvent , OverlayEventDetail } from '@ionic/core/components';
import { MultiSelectionSearchComponent } from 'src/app/modals/multi-selection-search/multi-selection-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize, first } from 'rxjs/operators';  
import { from, map, Subscription } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';
import { AccountProductItem, Item } from 'src/app/types/types';
import { AccountProductService } from 'src/app/services/model-services/account-product/account-product.service';
import { OfferService } from 'src/app/services/model-services/account-offer/offer.service';
import { IAccountOfferReq, IAccountOfferRes, IOfferDetailsRes, IProductOffer, IProductOfferDetails } from 'src/app/interfaces/DB_Models';
import {OfferComponent} from 'src/app/components/offer/offer.component';
import { OfferDetailsComponent } from 'src/app/components/offer/offer-details/offer-details.component';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';

//scrolling
import { ScrollingModule} from '@angular/cdk/scrolling';



@Component({
  selector: 'app-account-offer',
  templateUrl: './account-offer.page.html',
  styleUrls: ['./account-offer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , MultiSelectionSearchComponent,TranslateModule,RouterLink,OfferComponent,OfferDetailsComponent , ScrollingModule]
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

  productsCurrentPage : number = 0;
  productsPageSize : number = 11;
  productsCount : number = 0;

  productsLoading : boolean = false;

  searchTextValue : string = '';

  constructor(  private loadingCtrl : LoadingController  ) { }

  ngOnInit() {

    this.initGetAccountId();
    this.apiServer! = this.api.apiHost;
    this.initOfferRes();

  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: "lines-sharp",     
      mode: "ios"
    });

    loading.present();
  }

  async hideLoading(){
    await this.loadingCtrl.dismiss();
   }

  initGetAccountId(){
    this.subscriptionRoute = this.route.paramMap.subscribe((params)=>{
      this.accountId! = params.get('accountId') || '' ;
    });
  }

  initOfferRes(){

    this.showLoading();

    this.subscriptionOfferRes = this.offerService.getOfferByAccountId(this.accountId!)
    .pipe(finalize(()=>{
      this.hideLoading();
    }))
    .subscribe({

      next:(res:MessageResponse)=>{ 
        
        const offer = res.entity;

      if(offer) {
    
        const  _accountOfferRes : IAccountOfferRes = {
         
          id: offer.id,

          accountId: offer.accountId,

          accountName: offer.accountName,

          accountImage: offer.accountImage,

          off_name: offer.off_name,

          o_date: offer.o_date,

          startAt: offer.startAt,

          endAt: offer.endAt,

          o_image: offer.o_image,

          occasion_image: offer.occasion_image,

          is_active: offer._active,

          offerDetailsList: offer.offerDetailsList.map((offerDetails: any) => {

            const offerDetailsRes: IOfferDetailsRes = {
              id: offerDetails.id,
              offer_id: offer.id,
              product_id: offerDetails.product_id,
              product_name: offerDetails.product_name,
              product_image: offerDetails.product_image,
              unit: offerDetails.unit,
              max_quan: offerDetails.max_quan,
              max_limit: offerDetails.max_limit,
              percent_discount: offerDetails.percent_discount,
              price: offerDetails.price,
              o_price: offerDetails.o_price
            };

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
         
        //  this.products = this.offerRes.offerDetailsList.map((_product)=>{
        //       const product:AccountProductItem = {
        //         productId: _product.product_id,
        //         product_name: _product.product_name  ,
        //         product_image: _product.product_image 
        //       };
        //         return product;
        //  })

        this.products = Array.from(new Set( this.offerRes.offerDetailsList.map(obj => obj.product_id)))
                             .map(id =>  this.offerRes.offerDetailsList.find(obj => obj.product_id === id))
                             .map((_product)=>{
                                    const product:AccountProductItem = {
                                      productId: _product!.product_id,
                                      product_name: _product!.product_name,
                                      product_image: _product!.product_image 
                                    };
                                      return product;
                         });

         this.filteredProducts = [...this.products];

         this.productsArr! = [...this.products.map(({productId})=>  {return productId} )]

      }    

      }
      , error:(err)=>{
        console.log('error :' , err);
        this.hideLoading();
      },
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

  this.productsCurrentPage = 0 ;

  this.productsLoading = true ;

  this.items = [] ;
  if($value === '') return;

    this.searchTextValue = $value;

    this.showLoading();

    this.subscriptionSearch = this.accountProductService.getPageableProductsAccountByNameLike(
              this.accountId!,
              this.searchTextValue ,
              this.productsCurrentPage ,
              this.productsPageSize
            ).pipe(finalize(()=>{
              this.productsLoading = false ;
              setTimeout(()=> this.hideLoading(),1000);
            }),
            map((products:any) => { 
              this.productsCount = products.count;
              const _items:Item[] = products.list.map((product:any)=>{
              const productImage =  product.product_image && product.product_image !== '' ? `${this.apiServer}${product.product_image}` : '../../assets/images/no-image.jpg';   
              const isExists = this.productsArr!.includes(product.id);  
              const _product:Item = {
                id : product.id ,
                name : product.name,
                text : product.name ,
                value : product.id,
                des : product.descr,
                icon : productImage,
                exists : isExists
              } ; 
            return _product;
        }); 
            return _items;
       }
    )).subscribe(
      { 
        next:(products) => { this.items = products },
        error:  err =>{
          console.log(err);
          this.productsLoading = false ;
          setTimeout(()=> this.hideLoading(),1000);
         }
      }  
    );

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

      const productImage =  _product.product_image &&
                            _product.product_image !== '' ?
                            `${this.apiServer}${_product.product_image}` : '../../assets/images/no-image.jpg';  

      const product:AccountProductItem = {
          productId: _product.value,
          product_name: _product.text,
          product_image: productImage,
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
  
        this.subscriptionAccountProduct = this.productService.getProductOffer(this.accountId!, ''+product.productId).pipe(
          map((res:any) => { 
                const _product = res.entity;
                //const productImage =  product.product_image && product.product_image !== '' ? `${this.apiServer}${product.product_image}` : '../../assets/images/no-image.jpg';   
                const _offerProduct:IProductOffer = {
                  offer_id : this.offerRes.id,
                  product_id : _product.productId ,
                  product_name : _product.productName ,
                  product_image  : _product.product_image,
                  details : _product.details.map((detail:any)=>{
                      const _detail : IProductOfferDetails = {
                        id: detail.id,
                        unit_id: detail.uomId,
                        unit: detail.uomName,
                        max_quan: detail.maxQuan,
                        max_limit: detail.maxLimit,
                        percent_discount: detail.discount,
                        price: detail.price,
                        o_price: detail.offerPrice
                      }
                      return _detail;
                  })
                }
              return _offerProduct;
          }) 
        ).subscribe((product) => { 
           this.setCurrentOfferProduct(product);
         });


 
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
    
    this.setCurrentOfferProduct(_product);

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

  const productImage =  offerProduct.product_image !== undefined && offerProduct.product_image !== '' ? `${this.apiServer}${offerProduct.product_image}` : '../../assets/images/no-image.jpg';   
 
  const _product:AccountProductItem = {
    productId: offerProduct.product_id,
    product_name: offerProduct.product_name  ,
    product_image: productImage 
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

  loadMoreProducts(ev:any){

    this.productsCurrentPage++;

    this.productsLoading = true ;

    this.subscriptionSearch = this.accountProductService.getPageableProductsAccountByNameLike(
              this.accountId!,
              this.searchTextValue ,
              this.productsCurrentPage ,
              this.productsPageSize
            ).pipe(finalize(()=>{
              this.productsLoading = false ;
              setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
            }),
            map((products:any) => { 
              this.productsCount = products.count;
              const _items:Item[] = products.list.map((product:any)=>{
              const productImage =  product.product_image  && product.product_image !== '' ? `${this.apiServer}${product.product_image}` : '../../assets/images/no-image.jpg';   
              const isExists = this.productsArr!.includes(product.id);  
              const _product:Item = {
                id:product.id ,
                name:product.name,
                text: product.name ,
                value: product.id,
                des : product.descr,
                icon : productImage,
                exists : isExists
              } ; 
            return _product;
        }); 
            return _items;
      }
    )).subscribe(
      { 
        next:(products) => { this.items.push( ... products ); },
        error:  err =>{
          this.productsLoading = false ;
          setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
        }
      }  
    );
  }

    infiniteScrollEmit(ev:any){

      if( this.productsLoading ) return;

      if(this.searchTextValue === '')
      {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }
        
      const noMoreDataToFetch = (this.items!.length == this.productsCount);

      if(noMoreDataToFetch){
      // (ev as InfiniteScrollCustomEvent).target.complete();
        (ev as InfiniteScrollCustomEvent).target.disabled = true ;
      }
      else{
        setTimeout(() => {
          this.loadMoreProducts(ev);
        }, 1000);
      }
        
    }
}
