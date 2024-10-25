import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, switchMap, timer } from 'rxjs';
import { Order, OrderDetails, IOrderProduct, IOrderReq, IOrderOptionReq, IOrderPaymentReq, IOrderRateReq } from 'src/app/interfaces/DB_Models';
import { IAccountResponse } from '../../interfaces/Auth-Interfaces';
import { APIService } from '../../API/api.service';
import { HttpClient } from '@angular/common/http';
import { MessageResponse } from '../../interfaces/MessageResponse';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);

  private apiService = inject(APIService);
  

  orders : Order[] = [] ;

  private ordersBehaviorSubject = new BehaviorSubject<Order[]>(this.orders);

  private ordersBehaviorSubject$:Observable<Order[]> = this.ordersBehaviorSubject.asObservable();
  
  get getOrdersBehaviorSubject():Observable<Order[]>{
    return this.ordersBehaviorSubject$;
  }
  
  setOrdersBehaviorSubject(orders:Order[]){
    this.ordersBehaviorSubject.next(orders);
  }

  private  getCurrentOrder(accountId:number , seller:IAccountResponse) : number {
      const oIndex = this.orders.findIndex((e) => e.seller_id === accountId);
      const newIndex = oIndex === -1 ? this.createOrder(seller) : oIndex;
    return newIndex;
  }
  
  private createOrder(seller:IAccountResponse) : number {
    const _ord = new Order();
    _ord.seller_id = seller.id ;
    _ord.seller_name = seller.account_name ;
    _ord.seller_image = this.apiService.getResourcePath(seller.account_logo);
    _ord.currency = seller.currency!;
    _ord.min_quan = seller.min_quan ;
    _ord.min_value = seller.min_value;
    _ord.delivery_period = seller.delivery_period;
    this.orders.push(_ord);
    return this.orders.length - 1;
  }

  addProduct(detail:IOrderProduct , seller:IAccountResponse) : OrderDetails {

    const orderIndex = this.getCurrentOrder(detail.account_id,seller);

    if(!detail.order_index) 
    { 
        detail.order_index = orderIndex;
    }

    const order = detail.order_index ? this.orders[detail.order_index] : this.orders[orderIndex];

    const _ord_d = !detail.product_index ? new OrderDetails(): order.orderDetails[detail.product_index!];

    if(!detail.product_index){ 
      _ord_d.product_id  = detail.product_id ;
      _ord_d.product_name = detail.product_name ; 
      _ord_d.product_image = detail.product_image ;
      _ord_d.unit = detail.unit ;
      _ord_d.max_quan = detail.max_quan ;
      _ord_d.max_limit = detail.max_limit ;
      _ord_d.has_offer = detail.has_offer ;
      _ord_d.percent_discount = detail.percent_discount ;
      order.orderDetails.push(_ord_d);
      detail.product_index! = order.orderDetails.length -1;
    }

    _ord_d.orderProduct = detail;

    this.updateQuanDetail(detail);
    
     return _ord_d;
     
  }

  updateQuanDetail(detail:IOrderProduct){

      const _ord_d = this.orders[detail.order_index!].orderDetails[detail.product_index!];

      _ord_d.o_quan = 0 ;
      _ord_d.o_price = 0 ;

      _ord_d.quan = 0 ;
      _ord_d.price =  0 ;


      if( 
        !detail.has_offer  &&
        detail.max_limit === 0 
        ){

        _ord_d.o_quan = detail.quan_req! ;
        _ord_d.o_price = detail.o_price ;

      }
      else if( 
          !detail.has_offer  &&
          detail.max_limit > 0 &&
          detail.quan_req! <= detail.max_limit
        ){

        _ord_d.o_quan = detail.quan_req! ;
        _ord_d.o_price = detail.o_price ;

      }
      else  if( 
                !detail.has_offer  &&
                detail.max_limit > 0 &&
                detail.quan_req! > detail.max_limit 
              ){

        _ord_d.o_quan = detail.max_limit ;
        _ord_d.o_price = detail.o_price ;

      }
      else if(
        detail.has_offer  &&
        detail.max_limit > 0  &&
        detail.max_quan > 0 &&
        detail.quan_req! <= detail.max_quan &&
        detail.quan_req! <= detail.max_limit 
      )
        {
          _ord_d.o_quan = detail.quan_req! ;
          _ord_d.o_price = detail.o_price ;
        }
      else if(
            detail.has_offer  &&
            detail.max_limit > 0  &&
            detail.max_quan > 0 &&
            detail.quan_req! > detail.max_quan &&
            detail.quan_req! <= detail.max_limit 
            )
      {
        _ord_d.o_quan = detail.max_quan ;
        _ord_d.o_price = detail.o_price ;

        _ord_d.quan = detail.quan_req! - detail.max_quan ;
        _ord_d.price =  detail.price ;

      }
      else if(
        detail.has_offer  &&
        detail.max_limit > 0  &&
        detail.max_quan > 0 &&
        detail.quan_req! > detail.max_quan &&
        detail.quan_req! > detail.max_limit && 
        detail.max_limit > detail.max_quan
      )
        {
          _ord_d.o_quan = detail.max_quan ;
          _ord_d.o_price = detail.o_price ;

          _ord_d.quan = detail.max_limit - detail.max_quan ;
          _ord_d.price =  detail.price ;

        }

        _ord_d.calcDetail();


  }


  getOrder(orderId:string){

    const URL = this.apiService.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-order?orderId=${orderId}`)
        })
      );
  }


  getOrdersBySeller(sellerId:string){

    const URL = this.apiService.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-orders-by-seller?sellerId=${sellerId}`)
        })
      );
  }

  getOrdersByBuer(buyerId:string){

    const URL = this.apiService.apiHost;

    return timer(100)
      .pipe(
        switchMap(() => {
          return this.http.get<MessageResponse>(`${URL}/get-orders-by-buyer?sellerId=${buyerId}`)
        })
      );
  }

  updateOrder(order:IOrderReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-save-order`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );

  }

  updateOrderCancel(order:IOrderOptionReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-order-cancel`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );

  }

  updateOrderReject(order:IOrderOptionReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-order-reject`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );

  }

  updateOrderAccept(order:IOrderOptionReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-order-accept`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );

  }

  updateOrderOnRoad(order:IOrderOptionReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-order-on-road`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );

  }

  updateOrderReceive(order:IOrderOptionReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-order-receive`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );

  }

  updateOrderPayment(order:IOrderPaymentReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-order-payment`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );
  }

  updateOrderRateSeller(order:IOrderRateReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-order-rate-seller`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );

  }

  updateOrderRateBuyer(order:IOrderRateReq):Observable<MessageResponse>{
      
    const URL = this.apiService.apiHost;
    
    return this.http.post<MessageResponse>(`${URL}/set-order-rate-buyer`, order , this.apiService.headerJsonType ).pipe(
          delay(100)
      );

  }



}
