import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IOrderProduct, IOrderStatusReq, Order } from 'src/app/interfaces/DB_Models';
import { IonicModule } from '@ionic/angular';
import { QuantityInputComponent } from 'src/app/components/quantity-input/quantity-input.component';

@Component({
  selector: 'app-order-operating',
  templateUrl: './order-operating.component.html',
  styleUrls: ['./order-operating.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , TranslateModule , QuantityInputComponent]
})
export class OrderOperatingComponent  implements OnInit {

  @Input('orderDirection') orderDirection? : string  ;

  @Input('order') order? : Order  ;

  @Input('orderIdx') orderIdx? : number ;

  @Input('showHeader') showHeader : boolean = false ;

  @Input('showDetailsOption') showDetailsOption : boolean = false ;

  @Input('editableOption') editableOption : boolean = false ;

  @Output('fetchOrderEmitter') fetchOrderEmitter =  new EventEmitter<number>();

  @Output('deleteProductEmitter') deleteProductEmitter =  new EventEmitter<number>();

  @Output('updateProductEmitter') updateProductEmitter =  new EventEmitter<IOrderProduct>();

  @Output('updateOrderEmitter') updateOrderEmitter =  new EventEmitter<IOrderStatusReq>();

  showDetails : boolean = false ;

  showStatus : boolean = false ;

  orderStatus : string = '';

  orderTotalValue : number = 0 ;

  orderCashBack : number = 0 ;

  orderIn : boolean = false ;

  orderOut : boolean = false;

  constructor() { 
  }

  ngOnInit() {
     
    if(this.order!){
      this.orderTotalValue = this.order!.productsValue() ;
      this.orderCashBack = this.order!.cash_back ;
    }
   
  }

  deleteProduct(idx:number){
    this.deleteProductEmitter.emit(idx);
  }

  quanChange(orderProduct:IOrderProduct){
    this.updateProductEmitter.emit(orderProduct);
  }

  updateOrder(property:string){
    const orderStatusReq : IOrderStatusReq = {
      orderIndex: this.orderIdx!,
      status: property,
      orderId: this.order!.id,
      valueChanged: true
    }
    this.updateOrderEmitter.emit(orderStatusReq);
  }

  fetchOrder(){
    this.fetchOrderEmitter.emit(this.orderIdx!);
    this.orderStatus = this.order!.getStatus ;
  }
  
  showOrderStatus(){
    this.fetchOrder();
    this.showStatus = true ;
  
  }

  hideOrderStatus(){
    this.showStatus = false ;
  }

  showDetailsChanged(showDetails:any){
    console.log(showDetails);
  }

  orderStatusChanged(show_Status:any){
    this.orderIn = this.orderDirection! === 'in' ;
    this.orderOut = this.orderDirection! === 'out' ;
    if(this.showStatus)
      this.showOrderStatus();
    else
      this.hideOrderStatus();
  }



}
