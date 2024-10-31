import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IOrderProduct, Order } from 'src/app/interfaces/DB_Models';
import { IonicModule } from '@ionic/angular';
import { OrderProcedures } from 'src/app/types/enums';

@Component({
  selector: 'app-order-operating',
  templateUrl: './order-operating.component.html',
  styleUrls: ['./order-operating.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , TranslateModule]
})
export class OrderOperatingComponent  implements OnInit {

  @Input() OrderProcedure : OrderProcedures = OrderProcedures.Summary ;

  @Input('order') order? : Order ;

  @Input('showHeader') showHeader : boolean = false ;

  @Input('showDetailsOption') showDetailsOption : boolean = false ;

  @Input('editableOption') editableOption : boolean = false ;

  @Output('deleteProductEmitter') deleteProductEmitter =  new EventEmitter<number>();

  @Output('updateProductEmitter') updateProductEmitter =  new EventEmitter<IOrderProduct>();

  showDetails : boolean = false ;

  constructor() { }

  ngOnInit() {}

  deleteProduct(idx:number){
    this.deleteProductEmitter.emit(idx);
  }

  quanChange(orderProduct:IOrderProduct){
    this.updateProductEmitter.emit(orderProduct);
  }

}
