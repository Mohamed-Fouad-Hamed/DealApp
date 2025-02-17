import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { IUnit, IUomPriceRequest } from 'src/app/interfaces/DB_Models';

@Component({
  selector: 'app-uom-price-product',
  templateUrl: './uom-price-product.component.html',
  styleUrls: ['./uom-price-product.component.scss'],
  imports:[IonicModule, CommonModule, FormsModule, TranslateModule]
})

export class UomPriceProductComponent  implements OnInit {

   @Input('units') units : IUnit[] = [];
    
   @Input('uomPrice') uomPrice? :IUomPriceRequest;
    
   @Output('updateUomPrice') updateUomBarcode = new EventEmitter<IUomPriceRequest>(); 
    
   @Output('cancelUpdate') cancelUpdate = new EventEmitter<void>(); 
  
   isLoading:boolean = false ;
  
    constructor() { }
  
    ngOnInit() {}
  
    submit(){
      this.updateUomBarcode.emit(this.uomPrice);
    }
  
    cancel(){
       this.cancelUpdate.emit();
    }
  
  

}
