import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from 'src/app/services/model-services/order/order.service';
import { Subscription } from 'rxjs';
import { IOrderProduct, IOrderReq, Order } from 'src/app/interfaces/DB_Models';
import { OrderCardComponent } from 'src/app/components/order-card/order-card.component';
import { fromOrderToOrderReq } from 'src/app/interfaces/DB_Models';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.page.html',
  styleUrls: ['./cart-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule , OrderCardComponent]
})
export class CartPagePage implements OnInit , OnDestroy{

  private orderService = inject(OrderService);

  private orderSubscription?:Subscription;

  private orderBackSubscription?:Subscription;


  orders : Order[] = [];

  constructor() { 

  }

  ngOnDestroy(): void {

   if(this.orderSubscription)
      this.orderSubscription.unsubscribe();

   if(this.orderBackSubscription)
    this.orderBackSubscription.unsubscribe();

  }

  async ngOnInit() {

    this.orderSubscription!
        = this.orderService
              .getOrdersBehaviorSubject
              .subscribe((_ordes)=> this.orders = _ordes);
  }

  deleteOrder(idx:number){
     this.orders.splice(idx,1);
  }

  updateOrder(idx:number,order:Order){

    const orderReq : IOrderReq = fromOrderToOrderReq(order);
    
    this.orderBackSubscription = this.orderService
                                     .updateOrder(orderReq)
                                     .subscribe((message:MessageResponse)=>{
                                      if(message.status === 200){
                                     //   this.orderService.addOrderToOutput(order);
                                        this.orders.splice(idx,1);
                                       }
                                     });
  }

  deleteProduct(order:Order,idx:number){
    order.orderDetails.splice(idx,1);
  }

  updateProduct(orderProduct:IOrderProduct){
    this.orderService.updateQuanDetail(orderProduct);
  }
  

}
