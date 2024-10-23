import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IOrderProduct } from 'src/app/interfaces/DB_Models';
import { IAccountResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { QuantityInputComponent } from 'src/app/components/quantity-input/quantity-input.component';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QuantityInputComponent]
})
export class ProductCardComponent  implements OnInit {

 @Input('account') account? : IAccountResponse ; 

 @Input('currentProduct') currentProduct? : IOrderProduct ; 

 @Output('addNewProduct') addNewProduct : EventEmitter<any> = new EventEmitter<any>();

 @Output('updatedProduct') updatedProduct : EventEmitter<IOrderProduct> = new EventEmitter<IOrderProduct>();

 percentage?:string;

 priceStr?:string;

 oPriceStr?:string;

  constructor() { }

   async ngOnInit() {

    if(this.currentProduct!.percent_discount)
      this.percentage! = `${  this.currentProduct!.percent_discount + '\%' }`

     if( this.account && this.currentProduct!.price && this.currentProduct!.o_price  ){
        this.priceStr! = `${this.currentProduct!.price + ' ' + this.account!.currency!}`
        this.oPriceStr! = `${this.currentProduct!.o_price + ' ' + this.account!.currency!}`
     }

  }

  newProduct(){
    this.currentProduct!.quan_req!++;

    const params = { 
      product : this.currentProduct! ,
      account : this.account!
    }

    this.addNewProduct.emit(params);
  }

updateProduct(product:IOrderProduct){

  this.updatedProduct.emit(product);
}

}
