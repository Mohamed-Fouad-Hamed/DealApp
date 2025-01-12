import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, Subscription, timeout } from 'rxjs';
import { AccountProductService } from 'src/app/services/model-services/account-product/account-product.service';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';
import { IOrderProduct, Order } from 'src/app/interfaces/DB_Models';
import { APIService } from 'src/app/services/API/api.service';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { IAccountResponse, IUserResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { ProductCardComponent } from 'src/app/components/product-card/product-card.component';
import { SupplierCardComponent } from 'src/app/components/supplier-card/supplier-card.component';
import { OrderService } from 'src/app/services/model-services/order/order.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-by-account',
  templateUrl: './products-by-account.page.html',
  styleUrls: ['./products-by-account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SupplierCardComponent, ProductCardComponent,RouterLink]
})
export class ProductsByAccountPage implements OnInit , OnDestroy {

  private accountId?:string;
  private route = inject(ActivatedRoute);
  private subscription? : Subscription;
  private productsSubscription? : Subscription;
  private accountSellerSubscription?:Subscription;
  private accountBuyerSubscription?:Subscription;
  private orderServiceSubscription?:Subscription;
  private productService = inject(AccountProductService);
  private authService = inject(AuthenticationService);
  private apiService = inject(APIService);
 

  orders:Order[] =  [];

  currentOrder?:Order;

  currentOrderProducts? : IOrderProduct[];

  accountProducts : IOrderProduct[] =[];




  private buyerAccount?:IUserResponse;

  public sellerAccount?:IAccountResponse = {
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

   if(this.accountSellerSubscription)
    this.accountSellerSubscription.unsubscribe();

   if(this.accountBuyerSubscription)
    this.accountBuyerSubscription.unsubscribe();
  
   if(this.orderServiceSubscription)
     this.orderServiceSubscription.unsubscribe();

  }

  async ngOnInit() {

    this.showLoading();

    this.getAccountBuyer();
    
    this.subscription =  this.route.paramMap.subscribe((params)=>{

      this.accountId! = params.get('accountId') || '';
      
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
               const _products : IOrderProduct[] =
                 msg.list.map((_product:any)=>{
                  const findByAccountAndProduct =  this.currentOrderProducts ?
                     this.currentOrderProducts!.find((_d)=>_d.account_id === _product.account_id && _d.product_id === _product.product_id ) : undefined ;
                  const productInOrder =  
                        this.currentOrderProducts ? 
                        (findByAccountAndProduct ? findByAccountAndProduct : undefined) :undefined ;
                  const product : IOrderProduct = productInOrder ? productInOrder :
                        {
                          account_id : _product.account_id ,
                          product_id : _product.product_id ,
                          product_name : _product.product_name ,
                          product_image : _product.product_image && _product.product_image.length > 0 ? `${this.apiService.apiHost}${_product.product_image}` : '' ,
                          unit_id: _product.unit_id,
                          unit :_product.unit ,
                          price : _product.price ,
                          has_offer :_product.has_offer ,
                          max_quan : _product.max_quan ,
                          max_limit : _product.max_limit ,
                          percent_discount : _product.percent_discount , 
                          o_price : _product.o_price ,
                          quan_req : 0
                        };
                  return product;
                 });
                 return _products
           }),finalize(()=>{
            //setTimeout(()=>this.hideLoading(),1000);
           })).subscribe((products)=>{
                 this.accountProducts = products;
           });
  }

  getAccountSeller(_id:string){

    this.accountSellerSubscription =
        this.authService.getAccount(_id)
            .pipe(map((_account:IAccountResponse) =>
              { 
                _account.account_image = `${this.apiService.apiHost}${_account.account_image}`;
                return _account; 
              })
            , finalize(()=>{

              }))
            .subscribe(
              (account)=> {
                this.sellerAccount! = account;
                this.getProductsAccount();
              });



  }

  getAccountBuyer(){

    this.accountBuyerSubscription = 
         this.authService.getUserObservable
             .pipe(map((user)=> {
               user.account_image = `${this.apiService.apiHost}${user.account_image}` ;
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

  

}
