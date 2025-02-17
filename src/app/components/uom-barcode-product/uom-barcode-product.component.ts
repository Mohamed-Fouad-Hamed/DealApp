import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { IUnit, IUomBarcodeRequest } from 'src/app/interfaces/DB_Models';

@Component({
  selector: 'app-uom-barcode-product',
  templateUrl: './uom-barcode-product.component.html',
  styleUrls: ['./uom-barcode-product.component.scss'],
   imports:[IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class UomBarcodeProductComponent  implements OnInit {

    @Input('units') units : IUnit[] = [];
  
    @Input('uomBarcode') uomBarcode? :IUomBarcodeRequest;
  
    @Output('updateUomBarcode') updateUomBarcode = new EventEmitter<IUomBarcodeRequest>(); 
  
    @Output('cancelUpdate') cancelUpdate = new EventEmitter<void>(); 

    isLoading:boolean = false ;

  constructor() { }

  ngOnInit() {}

  submit(){
    this.updateUomBarcode.emit(this.uomBarcode);
  }

  cancel(){
     this.cancelUpdate.emit();
  }


}
