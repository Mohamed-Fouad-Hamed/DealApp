import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from 'src/app/services/model-services/order/order.service';
import { Subscription } from 'rxjs';
import { IOrderProduct, Order } from 'src/app/interfaces/DB_Models';
import { OrderCardComponent } from 'src/app/components/order-card/order-card.component';

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

  orders : Order[] = [];

  constructor() { 

  }

  ngOnDestroy(): void {

   if(this.orderSubscription)
      this.orderSubscription.unsubscribe();

  }

  async ngOnInit() {
    this.orderSubscription!
        = this.orderService
              .getOrdersBehaviorSubject
              .subscribe((_ordes)=> this.orders = _ordes);
  }

  deleteOrder(){

  }

  deleteProduct(idx:number){

  }

  updateProduct(orderProduct:IOrderProduct){
    this.orderService.updateQuanDetail(orderProduct);
  }
  

}
