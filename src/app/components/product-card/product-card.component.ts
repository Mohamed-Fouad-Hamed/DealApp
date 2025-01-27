import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IOrderProduct, IProductGroup } from 'src/app/interfaces/DB_Models';
import { IAccountResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { QuantityInputComponent } from 'src/app/components/quantity-input/quantity-input.component';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QuantityInputComponent , TranslateModule]
})
export class ProductCardComponent  implements OnInit {

 @Input('account') account? : IAccountResponse ; 

 @Input('currentProduct') currentProduct? : IProductGroup ; 

 @Output('addNewProduct') addNewProduct : EventEmitter<any> = new EventEmitter<any>();

 @Output('updatedProduct') updatedProduct : EventEmitter<IOrderProduct> = new EventEmitter<IOrderProduct>();

 percentage?:string;

 priceStr?:string;

 oPriceStr?:string;

 currentUnit? : IOrderProduct;

 customProductSelectOptions = {
  header: '' ,
  translucent: true,
};

  constructor() { }

   async ngOnInit() {
    this.customProductSelectOptions.header = this.currentProduct!.product_name ;
    this.currentUnit = this.currentProduct!.details[0];
    this.changePrices();
  }

  changePrices(){
    
    if(this.currentUnit!.percent_discount)
      this.percentage! = `${  this.currentUnit!.percent_discount + '\%' }`

     if( this.account && this.currentUnit!.price && this.currentUnit!.o_price  ){
        this.priceStr! = `${this.currentUnit!.price + ' ' + this.account!.currency!}`
        this.oPriceStr! = `${this.currentUnit!.o_price + ' ' + this.account!.currency!}`
     }
  }

  handleChange(event: Event){
    const target = event.target as HTMLIonSelectElement;
    this.currentUnit! = target.value as IOrderProduct;
    this.changePrices();
  }

  newProduct(){
    this.currentUnit!.quan_req!++;

    const params = { 
      product : this.currentUnit! ,
      account : this.account!
    }

    this.addNewProduct.emit(params);
  }

updateProduct(product:IOrderProduct){

  this.updatedProduct.emit(product);
}

}
