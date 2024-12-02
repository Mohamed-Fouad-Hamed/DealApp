import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderService } from 'src/app/services/model-services/order/order.service';
import { IOrderOptionReq, IOrderStatusReq, Order } from 'src/app/interfaces/DB_Models';
import { map,Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/API/api.service';
import { OrderOperatingComponent } from 'src/app/components/order-operating/order-operating.component';
import { entityToOrder } from 'src/app/interfaces/DB_Models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-incoming-orders',
  templateUrl: './incoming-orders.page.html',
  styleUrls: ['./incoming-orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , OrderOperatingComponent , TranslateModule]
})
export class IncomingOrdersPage implements OnInit , OnDestroy{

  private orderService  = inject(OrderService);

  private route = inject(ActivatedRoute);

  private api = inject(APIService);

  ordersIn : Order[] = [];

  accountId?:string ;

  apiServer?:string;

  private subscriptionRoute?:Subscription;

  private subscriptionIncomingOrders? : Subscription;

  constructor() { }

   ngOnDestroy(): void {
       if(this.subscriptionRoute!)
        this.subscriptionRoute!.unsubscribe();
       if(this.subscriptionIncomingOrders!)
        this.subscriptionIncomingOrders!.unsubscribe();
    }

   async ngOnInit() {

    this.initGetAccountId();

    this.apiServer! = this.api.apiHost;

    this.getIncomingOrders();
    
   }

   getIncomingOrders(){
    this.subscriptionIncomingOrders = 
        this.orderService.getOrdersBySeller(this.accountId!)
                         .pipe( map((__orders:any) => {

                           const ordersList = __orders.list.map((_order:any)=>{

                             return entityToOrder(_order);

                             });

                            return ordersList;
                         }))
                         .subscribe((_orders:Order[])=> {
                           this.ordersIn = _orders ;
                         } );
   }

  initGetAccountId(){
    this.subscriptionRoute = this.route.paramMap.subscribe((params)=>{
      this.accountId! = params.get('accountId') || '' ;
    });
  }

  fetchOrder(idx:number){
    const _order = this.ordersIn[idx];
    this.orderService.getOrder(''+_order.id)
                     .pipe(map((_order:any) => { return entityToOrder(_order); } ))
                     .subscribe((__order)=> this.ordersIn[idx] = __order);
  }

  updateOrder(updateStatus:IOrderStatusReq)
  {
    console.log('Status is --->  ' , updateStatus);

    const orderReq : IOrderOptionReq = {
      orderId: updateStatus.orderId,
      valueChanged: updateStatus.valueChanged
    } ;

    switch(updateStatus.status){
      case 'order.updateCancel':
        {
          this.orderService.updateOrderCancel(orderReq)
                          .pipe(map((_order:any) => { return entityToOrder(_order.entity); } ))
                          .subscribe((__order)=> this.ordersIn[updateStatus.orderIndex] = __order);
          break;
        }
      case 'order.updateAccepted':
        {
          this.orderService.updateOrderAccept(orderReq)
                          .pipe(map((_order:any) => { return entityToOrder(_order.entity); } ))
                          .subscribe((__order)=> this.ordersIn[updateStatus.orderIndex] = __order);
          break;
        }  
      case 'order.updateReject':
        {
          this.orderService.updateOrderReject(orderReq)
                          .pipe(map((_order:any) => { return entityToOrder(_order.entity); } ))
                          .subscribe((__order)=> this.ordersIn[updateStatus.orderIndex] = __order);
          break;
        } 
      case 'order.updateOnRoad':
        {
          this.orderService.updateOrderOnRoad(orderReq)
                          .pipe(map((_order:any) => { return entityToOrder(_order.entity); } ))
                          .subscribe((__order)=> this.ordersIn[updateStatus.orderIndex] = __order);
          break;
        } 
      case 'order.updateReceive':
        {
          this.orderService.updateOrderReceive(orderReq)
                          .pipe(map((_order:any) => { return entityToOrder(_order.entity); } ))
                          .subscribe((__order)=> this.ordersIn[updateStatus.orderIndex] = __order);
          break;
        }      

    }
  }

}
