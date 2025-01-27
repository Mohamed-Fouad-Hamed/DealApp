import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IOrderProduct, Order } from 'src/app/interfaces/DB_Models';
import { TranslateModule } from '@ngx-translate/core';
import { QuantityInputComponent } from 'src/app/components/quantity-input/quantity-input.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , TranslateModule, QuantityInputComponent]
})
export class OrderCardComponent  implements OnInit ,OnDestroy{

  @Input('index') index : number = -1;

  @Input('order') order? : Order ;

  @Output('deleteOrderEmitter') deleteOrderEmitter = new EventEmitter<void>();

  @Output('deleteProductEmitter') deleteProductEmitter =  new EventEmitter<number>();

  @Output('updateProductEmitter') updateProductEmitter =  new EventEmitter<IOrderProduct>();

  @Output('updateOrderEmitter') updateOrderEmitter =  new EventEmitter<void>();

  get validTotalValue():string{
    return `${this.order!.ValidValueInfo + ' ' + this.order!.currency!}`
  }

  sellerSubscription?:Subscription;

  constructor() { }

  ngOnDestroy(): void {
    if(this.sellerSubscription!)
      this.sellerSubscription!.unsubscribe();
  }

  ngOnInit() {
   
  }

  deleteOrder(){
    this.deleteOrderEmitter.emit();
  }

  deleteProduct(idx:number){
    this.deleteProductEmitter.emit(idx);
  }

  updateOrder(){
    this.updateOrderEmitter.emit();
  }

  quanChange(orderProduct:IOrderProduct){
    this.updateProductEmitter.emit(orderProduct);
  }

}
