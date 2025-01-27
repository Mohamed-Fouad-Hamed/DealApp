import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, Subscription, timeout } from 'rxjs';
import { AccountProductService } from 'src/app/services/model-services/account-product/account-product.service';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';
import { ICategoryResponse, IOrderProduct, IProductGroup, Order } from 'src/app/interfaces/DB_Models';
import { APIService } from 'src/app/services/API/api.service';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { IAccountResponse, IUserResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { ProductCardComponent } from 'src/app/components/product-card/product-card.component';
import { SupplierCardComponent } from 'src/app/components/supplier-card/supplier-card.component';
import { OrderService } from 'src/app/services/model-services/order/order.service';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products-by-account',
  templateUrl: './products-by-account.page.html',
  styleUrls: ['./products-by-account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SupplierCardComponent, ProductCardComponent,RouterLink,TranslateModule]
})
export class ProductsByAccountPage implements OnInit , OnDestroy {

  private accountId?:string;
  private route = inject(ActivatedRoute);
  private subscription? : Subscription;
  private productsSubscription? : Subscription;
  private accountSellerSubscription?:Subscription;
  private accountBuyerSubscription?:Subscription;
  private orderServiceSubscription?:Subscription;
  private categoriesSubscription?:Subscription;
  private productsOfferSubscription?:Subscription;
  private productService = inject(AccountProductService);
  private authService = inject(AuthenticationService);
  private apiService = inject(APIService);
 

  orders:Order[] =  [];

  currentOrder?:Order;

  currentOrderProducts? : IOrderProduct[];

  accountProducts : IProductGroup[] = [];

  categories :  ICategoryResponse[] = [] ;


  private buyerAccount?:IUserResponse;

  public sellerAccount:IAccountResponse = {
    id : 0 ,
    account_type:'',
    account_name:'',
    account_logo :'',
    account_image:'',
    min_value:0,
    min_quan:0,
    credit:0,
    rating:0,
    delivery_period : '',
    weekend  : '',
    work_hours  : ''
  }

  groupValue:string = "all";

  constructor( private orderService :OrderService, private loadingCtrl: LoadingController) { }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: "lines-sharp",     
      mode: "ios",
      duration:3000
    });

    loading.present();
  }

  async hideLoading(){
    await this.loadingCtrl.dismiss();
   }


  ngOnDestroy(): void {

   if(this.subscription)
      this.subscription.unsubscribe();


   if(this.productsSubscription)
      this.productsSubscription.unsubscribe();

   if(this.productsOfferSubscription)
    this.productsOfferSubscription.unsubscribe();

   if(this.accountSellerSubscription)
    this.accountSellerSubscription.unsubscribe();

   if(this.accountBuyerSubscription)
    this.accountBuyerSubscription.unsubscribe();
  
   if(this.orderServiceSubscription)
     this.orderServiceSubscription.unsubscribe();

   if(this.categoriesSubscription)
     this.categoriesSubscription.unsubscribe();

  }

  async ngOnInit() {

    this.showLoading();

    this.getAccountBuyer();
    
    this.subscription =  this.route.paramMap.subscribe((params)=>{

      this.accountId! = params.get('accountId') || '';

      this.groupValue = params.get('selectedTab') ||'';
      
      if(this.accountId! && this.accountId !==''){

        this.setCurrentOrder();
        
        this.getAccountSeller(this.accountId!);

      } 

    });
  }

  getProductsAccount(){

    this.productsSubscription = 
           this.productService.getProductsAccount(this.accountId!)
           .pipe(map((msg:MessageResponse)=>{
               const _products : IProductGroup[] =
                 msg.list.map((_product:any)=>{
               
                  const product : IProductGroup =
                        {
                          account_id: +this.accountId!,
                          product_id: _product.product_id,
                          product_name: _product.product_name,
                          product_image: _product.product_image && _product.product_image.length > 0 ? `${this.apiService.apiHost}${_product.product_image}` : 'assets/images/no-image.jpg',
                          details: _product.details.map((_detail: any) => {

                            const findByAccountAndProduct =  this.currentOrderProducts ?
                            this.currentOrderProducts!.find((_d) => _d.account_id === +this.accountId! 
                                                                 && _d.product_id === _product.product_id 
                                                                 && _d.unit_id === _detail.uom_id  ) : undefined ;
                            const productInOrder =  
                               this.currentOrderProducts ? 
                               (findByAccountAndProduct ? findByAccountAndProduct : undefined) :undefined ;

                            const detail: IOrderProduct = productInOrder ? productInOrder :{
                              account_id: +this.accountId!,
                              product_id: _product.product_id,
                              product_name: _product.product_name,
                              product_image: this.apiService.getResourcePath(_product.product_image),
                              unit_id: _detail.uom_id,
                              unit: _detail.uom_name,
                              price: _detail.price,
                              has_offer: _detail.has_offer,
                              max_quan: _detail.max_quan,
                              max_limit: _detail.max_limit,
                              percent_discount: _detail.percent_discount,
                              o_price: _detail.o_price,
                              quan_req : 0
                            };
                            return detail;
                          })

                        };
                  return product;
                 });
                 return _products
           }),finalize(()=>{
             setTimeout(()=>this.hideLoading(),1000);
           })).subscribe((products)=>{
                 this.accountProducts = products;
           });
  }

  getProductsOfferAccount(){
    
    this.productsOfferSubscription = 
           this.productService.getProductsOfferAccount(this.accountId!)
           .pipe(map((msg:MessageResponse)=>{
               const _products : IProductGroup[] =
                 msg.list.map((_product:any)=>{
               
                  const product : IProductGroup =
                        {
                          account_id: +this.accountId!,
                          product_id: _product.product_id,
                          product_name: _product.product_name,
                          product_image: _product.product_image && _product.product_image.length > 0 ? `${this.apiService.apiHost}${_product.product_image}` : 'assets/images/no-image.jpg',
                          details: _product.details.map((_detail: any) => {

                            const findByAccountAndProduct =  this.currentOrderProducts ?
                            this.currentOrderProducts!.find((_d) => _d.account_id === +this.accountId! 
                                                                 && _d.product_id === _product.product_id 
                                                                 && _d.unit_id === _detail.uom_id  ) : undefined ;
                            const productInOrder =  
                               this.currentOrderProducts ? 
                               (findByAccountAndProduct ? findByAccountAndProduct : undefined) :undefined ;

                            const detail: IOrderProduct = productInOrder ? productInOrder :{
                              account_id: +this.accountId!,
                              product_id: _product.product_id,
                              product_name: _product.product_name,
                              product_image: this.apiService.getResourcePath(_product.product_image),
                              unit_id: _detail.uom_id,
                              unit: _detail.uom_name,
                              price: _detail.price,
                              has_offer: _detail.has_offer,
                              max_quan: _detail.max_quan,
                              max_limit: _detail.max_limit,
                              percent_discount: _detail.percent_discount,
                              o_price: _detail.o_price,
                              quan_req : 0
                            };
                            return detail;
                          })

                        };
                  return product;
                 });
                 return _products
           }),finalize(()=>{
             setTimeout(()=>this.hideLoading(),1000);
           })).subscribe((products)=>{
                 this.accountProducts = products;
           });
  }


  getAccountSeller(_id:string){

    this.accountSellerSubscription =
        this.authService.getAccount(_id)
            .pipe(map((_account:IAccountResponse) =>
              { 
                _account.account_logo = this.apiService.getResourcePath(_account.account_logo);
                _account.account_image = this.apiService.getResourcePath(_account.account_image);

                return _account; 
              })
            , finalize(()=>{

              }))
            .subscribe(
              (account)=> {
                this.sellerAccount! = account;
                
                if(this.groupValue === 'all')
                   this.getProductsAccount();
                else if(this.groupValue === 'offers')  
                  this.getProductsOfferAccount();
              });



  }

  getAccountBuyer(){

    this.accountBuyerSubscription = 
         this.authService.getUserObservable
             .pipe(map((user)=> {
              user.account_logo = this.apiService.getResourcePath(user.account_logo);
              user.account_image = this.apiService.getResourcePath(user.account_image);
                return user;
              })).subscribe(
                (oUser)=> this.buyerAccount! = oUser
              );

  }

 async setCurrentOrder(){
    this.orderServiceSubscription = 
         this.orderService.getOrdersBehaviorSubject
                          .subscribe((_orders)=>
                            { 
                              this.orders = _orders ;
                              this.currentOrder = 
                                   this.orders.length > 0 ? this.orders.find((_order)=> _order.seller_id === parseInt(this.accountId!)) : undefined ;
                              this.currentOrderProducts = 
                                   this.currentOrder?.orderDetails ? this.currentOrder.orderDetails.map((_d)=> {return _d.orderProduct!}) : undefined ;
                             });
    
                      
  }

  addNewProduct(params:any){
    this.orderService.addProduct(params.product,params.account);
  }
  
  updateProduct(orderProduct:IOrderProduct){
    this.orderService.updateQuanDetail(orderProduct);
  }

  selectAllButtonClicked(){
    this.showLoading();
    this.getProductsAccount();
  }

  selectOffersButtonClicked(){
    this.showLoading();
    this.getProductsOfferAccount();
  }

  segmentButtonClicked(category:any){

  }

}
