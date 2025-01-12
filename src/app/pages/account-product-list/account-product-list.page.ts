import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController , LoadingController } from '@ionic/angular';
import { AccountProductDetail, AccountProductItem, Item, UomAccountPrice, UomPrice } from 'src/app/types/types';
import { Subscription, finalize, map } from 'rxjs';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';
import {  MultiSelectionSearchComponent} from 'src/app/modals/multi-selection-search/multi-selection-search.component';
import { InfiniteScrollCustomEvent, OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountProductService } from 'src/app/services/model-services/account-product/account-product.service';
import { APIService } from 'src/app/services/API/api.service';
import {AccountProductComponent} from 'src/app/components/account-product/account-product.component';
import { TranslateModule } from '@ngx-translate/core';
//scrolling
import { ScrollingModule} from '@angular/cdk/scrolling';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';


@Component({
  selector: 'app-account-product-list',
  templateUrl: './account-product-list.page.html',
  styleUrls: ['./account-product-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , MultiSelectionSearchComponent,AccountProductComponent,TranslateModule,RouterLink,ScrollingModule]
})
export class AccountProductListPage implements OnInit,OnDestroy {

  @ViewChild('modal') modal!: ModalController;

  private productService = inject(ProductService);

  private accountProductService = inject(AccountProductService);

  private route = inject(ActivatedRoute);

  private api = inject(APIService);

  accountId?:string ;

  accountProduct?:AccountProductDetail ;

  productsCurrentPage : number = 0;
  productsPageSize : number = 11;
  productsCount : number = 0;

  accountProductsCurrentPage : number = 0;
  accountProductsPageSize : number = 11;
  accountProductsCount : number = 0;

  accountProductCtx = {
    currentAccountId : this.accountId! ,
    currentAccountProduct : this.accountProduct!
  }

  items:Item[] = [] ;

  products:AccountProductItem[] = [] ;

  filteredProducts:AccountProductItem[] = [] ;

  apiServer?:string;

  private productsArr?:number[] = [];

  private subscriptionRoute?:Subscription;
  private subscriptionSearch? : Subscription;
  private subscriptionList? : Subscription;
  private subscriptionAccountProduct?: Subscription;
  private subscriptionNewProduct?: Subscription;
  private productsSubscription?:Subscription;
  private subscriptionAccountProductIds?: Subscription;

  selecteditemText:string = 'select item';

  productsLoading : boolean = false;

  accountProductsLoading : boolean = false;

  searchTextValue : string = '';

  searchAccountProductsValue? : string ;

  constructor( private loadingCtrl : LoadingController ) { }

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

  get directionRight(){
    return document.dir==='rtl';
  }
  
  ngOnInit() {
    this.initGetAccountId();
    this.initAccountProductsListIds();
    this.initAccountProductsList();
    this.apiServer! = this.api.apiHost;
  }

  initGetAccountId(){
    this.subscriptionRoute = this.route.paramMap.subscribe((params)=>{
      this.accountId! = params.get('accountId') || '' ;
    });
  }

  initAccountProductsListIds(){

    this.subscriptionAccountProductIds! = 
       this.accountProductService.getAccountProductsIds(this.accountId!)
       .pipe(map((msg:MessageResponse)=>{
          const ids = msg.list.map((product:any)=>  {return product.id} )
          return ids;
       }))
       .subscribe({ next:(ids:any)=>{
            this.productsArr! = [ ... ids] ;
       },error : (err)=>{

        console.log(err);

       }})

  }

  initAccountProductsList(){

     this.accountProductsCurrentPage = 0 ;
     this.accountProductsLoading = true ;
     this.showLoading();

     this.subscriptionList = this.accountProductService.getProductsAccountPageable(
             this.accountId!,
             this.accountProductsCurrentPage,
             this.accountProductsPageSize
            )
     .pipe(finalize(()=>{
         this.accountProductsLoading = false ;
         setTimeout(()=> this.hideLoading(),1000);
     }), map((products:any)=> {
                  this.accountProductsCount = products.count ;
                  const _products = products.list.map((_product:any)=>{ 
                    const productImage =  _product.product_image  && _product.product_image !== '' ? `${this.apiServer}${_product.product_image}` : '../../assets/images/no-image.jpg'; 
                    const product:AccountProductItem = {
                    productId: _product.id,
                    product_name: _product.name  ,
                    product_image: productImage
                  };
                    return product;
              });
                  return _products;
           }) ).subscribe({next :(_products:AccountProductItem[]) => {

                           this.filteredProducts = [ ... _products];
                          
                          },error : ()=>{

                            this.accountProductsLoading = false ;

                            setTimeout(()=> this.hideLoading(),1000);

                          }});
        
  }

  loadMoreAccountProducts(ev:any){

    if( this.accountProductsLoading ) return;

    this.accountProductsCurrentPage++ ;
    this.accountProductsLoading = true ;

    if(this.searchAccountProductsValue && this.searchAccountProductsValue !== ''){

        this.subscriptionList = this.accountProductService.getPageableProductsAccountByNameLike(
                this.accountId!,
                this.searchAccountProductsValue!,
                this.accountProductsCurrentPage,
                this.accountProductsPageSize
              )
        .pipe(finalize(()=>{
            this.accountProductsLoading = false ;
            setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
        }), map((products:any)=> {
                    this.accountProductsCount = products.count ;
                    const _products = products.list.map((_product:any)=>{ 
                      const productImage =  _product.product_image  && _product.product_image !== '' ? `${this.apiServer}${_product.product_image}` : '../../assets/images/no-image.jpg'; 
                      const product:AccountProductItem = {
                      productId: _product.id,
                      product_name: _product.name  ,
                      product_image: productImage
                    };
                      return product;
                });
                    return _products;
              }) ).subscribe({next :(_products:AccountProductItem[]) => {
                              

                              this.filteredProducts.push( ... _products );
                            
                            },error : ()=>{

                              this.accountProductsLoading = false ;
                              setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);

                            }});
          } else {

            this.subscriptionList = this.accountProductService.getProductsAccountPageable(
              this.accountId!,
              this.accountProductsCurrentPage,
              this.accountProductsPageSize
             )
            .pipe(finalize(()=>{
                this.accountProductsLoading = false ;
                setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
            }), map((products:any)=> {
                        this.accountProductsCount = products.count ;
                        const _products = products.list.map((_product:any)=>{ 
                          const productImage =  _product.product_image  && _product.product_image !== '' ? `${this.apiServer}${_product.product_image}` : '../../assets/images/no-image.jpg'; 
                          const product:AccountProductItem = {
                          productId: _product.id,
                          product_name: _product.name  ,
                          product_image: productImage
                        };
                          return product;
                    });
                        return _products;
                  }) ).subscribe({next :(_products:AccountProductItem[]) => {
      
                                  this.filteredProducts.push( ... _products );
                                
                                },error : ()=>{
      
                                  this.accountProductsLoading = false ;
      
                                  setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
      
                                }});

          }

  }

  getAccountProduct( accountId:string , productId:string  ){

    this.subscriptionAccountProduct = this.productService.getAccoutProduct(accountId,productId).pipe(
      map((res:any) => { 
            const _product = res.entity;
            const productImage =  _product.product_image  && _product.product_image !== '' ? `${this.apiServer}${_product.product_image}` : '../../assets/images/no-image.jpg'; 
            const _accountProduct:AccountProductDetail = {
              productId : _product.id ,
              product_name : _product.name ,
              descr  : _product.descr,
              category_name : '' ,
              product_image  : productImage ,
              has_first : false,
              first_unit : ' ' + _product.first_unit + ' ',
              first_price : 0,
              has_second  : false,
              second_unit : ' ' + _product.second_unit + ' ',
              second_price : 0 ,
              uomPriceList : _product.uomPriceDtoList.map((priceDto:any)=>{ 
                const uomPrice : UomPrice = {
                    id: priceDto.id,
                    uom_id: priceDto.uom_id,
                    unit_name: priceDto.unit_name,
                    base_cost: priceDto.base_cost,
                    base_price: priceDto.base_price,
                    reduce_per: priceDto.reduce_per,
                    cost_price: priceDto.cost_price,
                    price: priceDto.price
                  };
                return uomPrice;
            }) ,
            uomAccountPriceList : _product.accountProducts.map((price:any)=>{
                const uomAccountPrice : UomAccountPrice = {
                      uom_id: price.uom_id,
                      base_cost: price.base_cost,
                      base_price: price.base_price,
                      reduce_per: price.reduce_per,
                      cost_price: price.cost_price,
                      price: price.price
                    };
                return uomAccountPrice;
            })
            }
          return _accountProduct;
      }) 
    ).subscribe((product) => { 
       this.setCurrentAccountProduct(product);
     });

  }

  trackItems(index: number, product: AccountProductItem) {
    return product.productId;
  }

  ngOnDestroy(): void {
      if(this.subscriptionRoute) this.subscriptionRoute!.unsubscribe();
      if(this.subscriptionList) this.subscriptionList!.unsubscribe();
      if(this.subscriptionSearch) this.subscriptionSearch!.unsubscribe();
      if(this.subscriptionAccountProduct) this.subscriptionAccountProduct!.unsubscribe();
      if(this.subscriptionNewProduct) this.subscriptionNewProduct!.unsubscribe();
      if(this.productsSubscription) this.productsSubscription!.unsubscribe();
      if(this.subscriptionAccountProductIds) this.subscriptionAccountProductIds!.unsubscribe();
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
        const product:AccountProductItem = {
        productId: _product.value,
        product_name: _product.text,
        product_image: _product.icon,
        notUpdate:true
      };
        return product;
      });

     // this.products = [...this.products,..._itemsSelected];

      this.filteredProducts.unshift(..._itemsSelected);

      this.productsArr?.push(...data);   
    }

    this.items = [];

  }

  viewDetail(product:AccountProductItem){

    if(product.notUpdate!){

          this.subscriptionNewProduct = this.productService.getAccoutProduct(this.accountId!,''+product.productId).pipe(
            map((res:any) => { 
                  const _product = res.entity;
                  const productImage =  _product.product_image  && _product.product_image !== '' ? `${this.apiServer}${_product.product_image}` : '../../assets/images/no-image.jpg'; 
                  const _accountProduct:AccountProductDetail = {
                    productId : _product.id ,
                    product_name : _product.name ,
                    descr  : _product.descr,
                    category_name : '' ,
                    product_image  : productImage ,
                    has_first : false,
                    first_unit : ' ' + _product.first_unit + ' ',
                    first_price : 0,
                    has_second  : false,
                    second_unit : ' ' + _product.second_unit + ' ',
                    second_price : 0 ,
                    uomPriceList : _product.uomPriceDtoList.map((priceDto:any)=>{ 
                      const uomPrice : UomPrice = {
                          id: priceDto.id,
                          uom_id: priceDto.uom_id,
                          unit_name: priceDto.unit_name,
                          base_cost: priceDto.base_cost,
                          base_price: priceDto.base_price,
                          reduce_per: priceDto.reduce_per,
                          cost_price: priceDto.cost_price,
                          price: priceDto.price
                        };
                      return uomPrice;
                  }) ,
                  uomAccountPriceList : _product.accountProducts.map((price:any)=>{
                      const uomAccountPrice : UomAccountPrice = {
                            uom_id: price.uom_id,
                            base_cost: price.base_cost,
                            base_price: price.base_price,
                            reduce_per: price.reduce_per,
                            cost_price: price.cost_price,
                            price: price.price
                          };
                      return uomAccountPrice;
                  })
                  }
                return _accountProduct;
            }) 
          ).subscribe((product) => { 
             this.setCurrentAccountProduct(product);
           });

    }
    else

      this.getAccountProduct(this.accountId!,''+product.productId);
   
  }

  private setCurrentAccountProduct(product:any){
    this.accountProduct!  = product
    this.accountProductCtx = {
      currentAccountId : this.accountId! ,
      currentAccountProduct : this.accountProduct!
    }
  }

  accountProductSaved(accountProduct:any){

    const productImage =  accountProduct.product_image  && accountProduct.product_image !== '' ? `${this.apiServer}${accountProduct.product_image}` : '../../assets/images/no-image.jpg'; 

    const _product:AccountProductItem = {
      productId: accountProduct.productId,
      product_name: accountProduct.product_name ,
      product_image: productImage 
    };

    const idx = this.filteredProducts.findIndex(
      (product)=> product.productId === accountProduct.productId
    );
    
    if(idx > -1){
       this.filteredProducts.splice(idx,1,_product);
    }
    else
       this.filteredProducts.push(_product);

       this.resetFilterProducts();
  }

  cancelAccountProductDailog(){

     this.resetFilterProducts();
  }

  resetFilterProducts(){
   // this.filteredProducts = [...this.products];
    this.accountProduct = undefined;
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
    // if (searchQuery === undefined) {
    //   this.filteredProducts = [...this.products];
    // } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      // const normalizedQuery = searchQuery.toLowerCase();
      // this.filteredProducts = this.products.filter((item) => {
      //   return item.product_name.toLowerCase().includes(normalizedQuery);
      // });
   // }

   if(!searchQuery || searchQuery === '') {
      this.searchAccountProductsValue = searchQuery;
      this.initAccountProductsList();
      return;
   } 

    this.searchAccountProductsValue = searchQuery ;

    this.accountProductsCurrentPage = 0 ;
    this.accountProductsLoading = true ;

    this.showLoading();

    this.subscriptionList = this.accountProductService.getPageableProductsAccountByNameLike(
            this.accountId!,
            this.searchAccountProductsValue!,
            this.accountProductsCurrentPage,
            this.accountProductsPageSize
           )
    .pipe(finalize(()=>{
        this.accountProductsLoading = false ;
        setTimeout(()=> this.hideLoading() ,1000);
    }), map((products:any)=> {
                 this.accountProductsCount = products.count ;
                 const _products = products.list.map((_product:any)=>{ 
                   const productImage =  _product.product_image  && _product.product_image !== '' ? `${this.apiServer}${_product.product_image}` : '../../assets/images/no-image.jpg'; 
                   const product:AccountProductItem = {
                   productId: _product.id,
                   product_name: _product.name  ,
                   product_image: productImage
                 };
                   return product;
             });
                 return _products;
          }) ).subscribe({next :(_products:AccountProductItem[]) => {
                  

                          this.filteredProducts = [..._products];
                         
                         },error : ()=>{

                           this.accountProductsLoading = false ;
                           setTimeout(()=> this.hideLoading() ,1000);

                         }});


  }


  loadMoreProducts(ev:any){

    this.productsCurrentPage++;

    this.productsLoading = true ;

    this.subscriptionSearch = this.productService.getPageableProductsByNameLikePageable(
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

  onIonInfiniteCurrentProducts(ev:any){

    if(this.accountProductsLoading) return;
      
    const noMoreDataToFetch = (this.filteredProducts!.length == this.accountProductsCount);

    if(noMoreDataToFetch){
         (ev as InfiniteScrollCustomEvent).target.complete();
         //(ev as InfiniteScrollCustomEvent).target.disabled = true ;
    }
    else{
      setTimeout(() => {
        this.loadMoreAccountProducts(ev);
      }, 1000);
    }
  }

}

