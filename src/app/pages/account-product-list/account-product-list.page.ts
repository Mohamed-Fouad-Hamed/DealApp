import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController } from '@ionic/angular';
import { AccountProductDetail, AccountProductItem, Item } from 'src/app/types/types';
import { Subscription, map } from 'rxjs';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';
import {  MultiSelectionSearchComponent} from 'src/app/modals/multi-selection-search/multi-selection-search.component';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountProductService } from 'src/app/services/model-services/account-product/account-product.service';
import { APIService } from 'src/app/services/API/api.service';
import {AccountProductComponent} from 'src/app/components/account-product/account-product.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-account-product-list',
  templateUrl: './account-product-list.page.html',
  styleUrls: ['./account-product-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , MultiSelectionSearchComponent,AccountProductComponent,TranslateModule,RouterLink]
})
export class AccountProductListPage implements OnInit,OnDestroy {

  @ViewChild('modal') modal!: ModalController;

  private productService = inject(ProductService);

  private accountProductService = inject(AccountProductService);

  private route = inject(ActivatedRoute);

  private api = inject(APIService);

  accountId?:string ;

  accountProduct?:AccountProductDetail ;

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

  selecteditemText:string = 'select item';

  constructor() { 
  
  }

  get directionRight(){
    return document.dir==='rtl';
  }
  
  ngOnInit() {
    this.initGetAccountId();
    this.initAccountProductsList();
    this.apiServer! = this.api.apiHost;
  }

  initGetAccountId(){
    this.subscriptionRoute = this.route.paramMap.subscribe((params)=>{
      this.accountId! = params.get('accountId') || '' ;
    });
  }

  initAccountProductsList(){
     this.subscriptionList = this.accountProductService.getAccountProducts(this.accountId!)
     .pipe(map((products:any)=> {
                  const _products = products.list.map((_product:any)=>{ 
                    const product:AccountProductItem = {
                    productId: _product.productId,
                    product_name: _product.product_name + ' ' + _product.descr ,
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


  getAccountProduct( accountId:string , productId:string  ){

    this.subscriptionAccountProduct = this.accountProductService.getAccountProduct(
      accountId,
      productId
      ).pipe(map((product:any)=>{ const _product : AccountProductDetail= { 
         productId : product.productId ,
         product_name : product.product_name + ' ' + product.descr,
         descr  : product.descr,
         category_name : product.category_name ,
         product_image  : product.product_image ,
         has_first : product.has_first,
         first_unit : ' ' + product.first_unit + ' ',
         first_price : product.first_price,
         has_second  : product.has_second,
         second_unit : ' ' + product.second_unit + ' ',
         second_price : product.second_price
        } 
       return _product;
      })).subscribe((product)=>{ 
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
  }

  searchValueEmit($value:any){
    this.items = [] ;
    if($value === '') return;
    this.subscriptionSearch = this.productService.getProductsByName($value).pipe(
            map((products:any) => { 
              const _items:Item[] = products.list.map((product:any)=>{
              const isExists = this.productsArr!.includes(product.id);  
              const _product:Item = {
                id:product.id ,
                name:product.name,
                text: product.name + ' ' + product.descr,
                value: product.id,
                des :product.descr,
                icon :product.product_image,
                exists:isExists
              } ; 
            return _product;
        }); 
            return _items;
       }
    )).subscribe((products) => { this.items = products });
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

          this.subscriptionNewProduct = this.productService.getProduct(''+product.productId).pipe(
            map((res:any) => { 
                  const _product = res.entity;
                  const _accountProduct:AccountProductDetail = {
                    productId : _product.id ,
                    product_name : _product.name + ' ' +  _product.descr,
                    descr  : _product.descr,
                    category_name : '' ,
                    product_image  : _product.product_image ,
                    has_first : false,
                    first_unit : ' ' + _product.first_unit + ' ',
                    first_price : 0,
                    has_second  : false,
                    second_unit : ' ' + _product.second_unit + ' ',
                    second_price : 0
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

    const _product:AccountProductItem = {
      productId: accountProduct.productId,
      product_name: accountProduct.product_name + ' ' + accountProduct.descr,
      product_image: accountProduct.product_image 
    };

    const idx = this.products.findIndex(
      (product)=> product.productId === accountProduct.productId
    );
    
    if(idx > -1){
       this.products.splice(idx,1,_product);
    }
    else
       this.products.push(_product);

       this.resetFilterProducts();
  }

  cancelAccountProductDailog(){

     this.resetFilterProducts();
  }

  resetFilterProducts(){
    this.filteredProducts = [...this.products];
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
}

