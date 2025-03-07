import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule  ,PopoverController, AnimationController , LoadingController , ModalController} from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IProductRequest, IProductResponse, IUnit, IUomBarcodeRequest, IUomConverterItemDto, IUomGroupItemDto, IUomPriceRequest } from 'src/app/interfaces/DB_Models';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';
import { Subscription, finalize, map } from 'rxjs';
import {  Router, RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { AbstractItem, Item, SingleItem } from 'src/app/types/types';
import { PopoverSelectComponent } from 'src/app/modals/popover-select/popover-select.component';
import { CategoryService } from 'src/app/services/model-services/category-service/category.service';
import { IAccountResponse, IUserResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { OverlayEventDetail, InfiniteScrollCustomEvent } from '@ionic/core';
import { SingleSelectionSearchComponent } from 'src/app/modals/single-selection-search/single-selection-search.component';
import { SearchableSelectComponent } from 'src/app/components/searchable-select/searchable-select.component';
import { APIService } from 'src/app/services/API/api.service';
import { UomGroupService } from 'src/app/services/model-services/uom-group-service/uomgroupservice';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonicModule , CommonModule, FormsModule, TranslateModule,RouterLink,IonRouterLink,SingleSelectionSearchComponent,SearchableSelectComponent ]
})
export class ProductPage implements OnInit , OnDestroy {

  @ViewChild('modal') modal!: ModalController;

  private router = inject(Router);

  private popoverController = inject( PopoverController); 

  private uomGroupService = inject(UomGroupService);

  private authService = inject(AuthenticationService);

  private api = inject(APIService);

  private apiServer!:string;

  @ViewChild('productForm') public productFrm!: NgForm;
 
  isLoading : boolean = false ;

  imageUrl:string = '';

  error:string = '';

  currentTab:string='baseuom';

  private subscription? : Subscription;

  private categorySubscription? : Subscription;

  private factoryAccountsSubscription? : Subscription;

  private subscriptionProducts? : Subscription;

  private subscriptionUomGroup? : Subscription;

  private subscriptionUnits? : Subscription;

  private subscriptionSearch? :Subscription;

  mItems : AbstractItem[] = [] ;

  aItems : AbstractItem[] = [] ;

  private observableUser? : IUserResponse;

  product:IProductRequest = {
    id: 0,
    name: '',
    descr: '',
    has_first: false,
    first_unit: '',
    first_price: 0,
    unit_count_first: 0,
    has_second: false,
    second_unit: '',
    second_price: 0,
    unit_count_second: 0,
    category_id: 0,
    factory_id:0,
    uom_group: 0,
    uom_base: 0,
    base_cost: 0,
    base_price: 0,
    accept: false,
    reject: false,
    uomPriceList: [],
    uomBarcodeList: []
  };

             
              
  private get newProduct():IProductRequest {
    const nProduct : IProductRequest = {
      id: 0,
      name: '',
      descr: '',
      has_first: false,
      first_unit: '',
      first_price: 0,
      unit_count_first:0,
      has_second: false,
      second_unit: '',
      second_price: 0,
      unit_count_second:0,
      category_id: 0,
      factory_id: 0,
      uom_group: 0,
      uom_base: 0,
      base_cost: 0,
      base_price: 0,
      accept: false,
      reject: false,
      uomPriceList: [],
      uomBarcodeList: []
    };
    return nProduct;
}

addNewProduct(){
 this.product  = this.newProduct;
} 

addUPrice(){
    const uPrice : IUomPriceRequest = {
      id: 0,
      productId: 0,
      uomId: 0,
      base_cost: 0,
      base_price: 0,
      reduce_per: 0,
      cost_price: 0,
      price: 0,
      price_auto: false
    }
    this.product.uomPriceList.push( uPrice);
}

addUBarcode(){
    const uBarcode : IUomBarcodeRequest = {
      id: 0,
      productId: 0,
      uomId: 0,
      uom_barcode: '',
      freetext: ''
    }
      this.product.uomBarcodeList.push( uBarcode);
  
}
 
  productResponse:IProductResponse = {
          id:0,
          name:'',
          descr:'',
          has_first:false,
          first_unit:'',
          first_price:0,
          unit_count:0,
          has_second:false,
          second_unit:'',
          second_price:0,
          product_image:''
        };
       
    isToastOpen = false;

    productsCurrentPage : number = 0;

    productsPageSize : number = 11;

    productsCount : number = 0;

    productsLoading : boolean = false;

    searchTextValue : string = '';

    items:Item[] = [] ;

    units:IUnit[] = [];

    uomGroups : IUomGroupItemDto[] = [];

    uomConverters : IUomConverterItemDto[] = [];

 setOpenToast(isOpen: boolean) {
          this.isToastOpen = isOpen;
 }

  constructor(private animationCtrl : AnimationController,
              private loadingCtrl : LoadingController,
              private categoryService : CategoryService,
              private productService : ProductService ) { }
  
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

 enterAnimation = (baseEl: HTMLElement) => {
   const root = baseEl.shadowRoot;

   const backdropAnimation = this.animationCtrl
     .create()
     .addElement(root!.querySelector('ion-backdrop')!)
     .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

   const wrapperAnimation = this.animationCtrl
     .create()
     .addElement(root!.querySelector('.modal-wrapper')!)
     .keyframes([
       { offset: 0, opacity: '0', transform: 'scale(0)' },
       { offset: 1, opacity: '0.99', transform: 'scale(1)' },
     ]);

   return this.animationCtrl
     .create()
     .addElement(baseEl)
     .easing('ease-out')
     .duration(500)
     .addAnimation([backdropAnimation, wrapperAnimation]);
 };

 leaveAnimation = (baseEl: HTMLElement) => {
   return this.enterAnimation(baseEl).direction('reverse');
 };



  ngOnDestroy(): void {
    if(this.subscription) this.subscription!.unsubscribe();
    if(this.categorySubscription) this.categorySubscription!.unsubscribe();
    if(this.factoryAccountsSubscription) this.factoryAccountsSubscription!.unsubscribe();
    if(this.subscriptionProducts) this.subscriptionProducts.unsubscribe();
    if(this.subscriptionSearch) this.subscriptionSearch.unsubscribe();
    if(this.subscriptionUnits) this.subscriptionUnits.unsubscribe();
    if(this.subscriptionUomGroup) this.subscriptionUomGroup.unsubscribe();
  }

  ngOnInit() {
    this.apiServer = this.api.apiHost;
    this.initiUser();
    this.initiCategories();
    this.getUnits();
    this.getUomGroups();
  }


  initiUser(){

    this.authService.getUserAuth().subscribe((oUser)=>{
      this.observableUser = oUser;
      this.initiAccounts(this.observableUser!.account_type);
    });
     
  }

  initiAccounts(account_type:string){

    this.factoryAccountsSubscription = this.productService.getFactoryAccountsByAccountType(account_type)
                                      .pipe(map((accounts:any) => {
                                            const _accounts : AbstractItem [] = 
                                            accounts.map((account:IAccountResponse) => { const _account : AbstractItem =  { id:account.id,name:account.account_name } ; 
                                            return _account; 
                                            });
                                            
                                            return _accounts;
                                         }))
                                      .subscribe((accounts)=>{  
                                                  this.aItems = accounts ; 
                                        })

  }


  initiCategories(){
    this.categorySubscription = this.categoryService.getCategories()
    .pipe(map((categories:any) => {
          const _categories : AbstractItem [] = 
          categories.map((category:any) => { const _category : AbstractItem =  { id:category.id , name:category.name } ; 
          return _category; 
          });
          
          return _categories;
       }))
    .subscribe((categories)=>{  
                this.mItems = categories ; 
      });
  }

  async getUnits(){
    this.showLoading();
    this.subscriptionUnits = this.uomGroupService.getUnits().pipe(finalize(()=>{
              setTimeout(()=> this.hideLoading(),1000);
            }),
            map((units:any) => { 
              const _items:IUnit[] = units.list.map((unit:any)=>{

              const _unit:IUnit = {
                id:unit.id ,
                name:unit.name
              } ; 

            return _unit;
        }); 
            return _items;
      }
    )).subscribe(
      { 
        next:(units) => { 
          this.units = [...units];
         },
        error:  err =>{
          setTimeout(()=> this.hideLoading(),1000);
        }
      }  
    );
 }

getUomGroups(){
 this.subscriptionUomGroup = this.uomGroupService.getAllUomGroup().subscribe(
      { 
        next:(msg) => { 
            this.uomGroups = msg.list;
        },
        error:  err =>{
            console.log(err);
        }
      }  
    );
}

getUomConverters(id:number){
   const uomConvertersList = this.uomGroups.filter((uomGroup) => uomGroup.id === id);
   return uomConvertersList.length && uomConvertersList.length > 0 ? uomConvertersList[0].uomConverterItemDtoList : [];
}

uomGroupsSelectChanged(event:any){
   this.uomConverters = event.length && event.length > 0 ? this.getUomConverters(event[0].id) : [] ;
}
  async  onSubmit() {

    if (this.productFrm.invalid) {
      return;
    }
  
    this.isLoading = true;
    try{
   
      this.subscription = this.productService.uploadProduct(
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
                const{id} = res.entity;
                this.setOpenToast(true)
                setTimeout(()=> {this.router.navigate([`/product-profile/${id}`])},2000)
           }
          
         }
         ,error:(err)=>{ this.error = err.message }} 
        );

    }catch( e:any){
      this.error = e.message;
    
    }


  }


  searchValueEmit($value:any){
        
            this.productsCurrentPage = 0 ;
        
            this.productsLoading = true ;
        
            this.items = [] ;
        
            if($value === '') return;
        
            this.searchTextValue = $value;
        
            this.showLoading();
        
            this.subscriptionSearch = this.productService.getPageableProductsByNameLikePageable($value ,this.productsCurrentPage,this.productsPageSize).pipe(finalize(()=>{
                      this.productsLoading = false ;
                      setTimeout(()=> this.hideLoading(),1000);
                    }),
                    map((products:any) => { 
                      this.productsCount = products.count;
                      const _items:Item[] = products.list.map((product:any)=>{
                      const productImage =  product.product_image  && product.product_image !== '' ? `${this.apiServer}${product.product_image}` : '../../assets/images/no-image.jpg';    
                      const _product:Item = {
                        id:product.id ,
                        name:product.name,
                        text: product.name ,
                        value: product.id,
                        des : product.descr,
                        icon : productImage
                      } ; 
                    return _product;
                }); 
                    return _items;
               }
            )).subscribe(
              { 
                next:(products) => { this.items = products },
                error:  err =>{
                  this.productsLoading = false ;
                  setTimeout(()=> this.hideLoading(),1000);
                 }
              }  
            );
            
          }
        
       onWillDismiss(event: Event) {
     
           const ev = event as CustomEvent<OverlayEventDetail<any>>;
           const {role , data } = ev.detail;
           if (role === 'confirm' && data) {
            
             this.showLoading();
     
             this.subscriptionProducts = this.productService.getProductFDto(data.value).pipe(finalize(()=>{
                   setTimeout(()=> this.hideLoading(),1000);
                 })
               ,map((msg)=>{
                 const product = msg.entity ;
                 const productMapper : IProductRequest = {
                   id: product.id,
                   name: product.name,
                   descr: product.descr,
                   has_first: product.has_first,
                   first_unit: product.first_unit,
                   first_price: product.first_price,
                   unit_count_first:product.unit_count_first,
                   has_second: product.has_second,
                   second_unit: product.second_unit,
                   second_price: product.second_price,
                   unit_count_second: product.unit_count_second,
                   category_id: product.category_id,
                   factory_id: product.factory_id,
                   uom_group: product.uom_group,
                   uom_base: product.uom_base,
                   base_cost: product.base_cost,
                   base_price: product.base_price,
                   accept: product.accept,
                   reject: product.reject,
                   uomPriceList: product.uomPriceList.map((uPrice:any)=>{ 
                        const uomPrice:IUomPriceRequest = {
                              id: uPrice.id,
                              productId: uPrice.productId,
                              uomId: uPrice.uomId,
                              base_cost: uPrice.base_cost,
                              base_price: uPrice.base_price,
                              reduce_per: uPrice.reduce_per,
                              cost_price: uPrice.cost_price,
                              price: uPrice.price,
                              price_auto: uPrice.price_auto
                            };
                            return uomPrice;
                     }) ,
                   uomBarcodeList: product.uomBarcodeList.map((uBarcode:any)=>{
                        const uomBarcode : IUomBarcodeRequest = {
                          id: uBarcode.id,
                          productId: uBarcode.productId,
                          uomId: uBarcode.uomId,
                          uom_barcode: uBarcode.uom_barcode,
                          freetext: uBarcode.freetext
                        };
                        return uomBarcode;
                   })
                 }
                 return productMapper ;
               })).subscribe(
           { 
             next:(product) => { 
              
               this.uomConverters = this.getUomConverters(product.uom_group);
               
               this.product = product; 
   
              
             },
             error:  err =>{
               setTimeout(()=> this.hideLoading(),1000);
             }
           }  
           );
           
           }
       
           this.items = [];
       
         }
       
     
        itemSelected($item:any){
         this.modal.dismiss($item,'confirm');
       }
     
       loadMoreProducts(ev:any){
       
           this.productsCurrentPage++;
       
           this.productsLoading = true ;
       
           this.subscriptionSearch = this.productService.getPageableProductsByNameLikePageable(this.searchTextValue ,this.productsCurrentPage,this.productsPageSize).pipe(finalize(()=>{
                     this.productsLoading = false ;
                     setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
                   }),
                   map((products:any) => { 
                    this.productsCount = products.count;
                    const _items:Item[] = products.list.map((product:any)=>{
                    const productImage =  product.product_image  && product.product_image !== '' ? `${this.apiServer}${product.product_image}` : '../../assets/images/no-image.jpg';    
                    const _product:Item = {
                      id:product.id ,
                      name:product.name,
                      text: product.name ,
                      value: product.id,
                      des : product.descr,
                      icon : productImage
                    } ; 
                  return _product;
               }); 
                   return _items;
             }
             )).subscribe(
             { 
               next:(products) => { this.items.push( ... products); },
               error:  err =>{
                 console.log(err);
                 this.productsLoading = false ;
                 setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
                 setTimeout(()=> this.hideLoading(),1000);
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
