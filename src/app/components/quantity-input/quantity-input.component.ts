import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , AlertController} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowDownCircleOutline , arrowUpCircleOutline
  } from 'ionicons/icons';

  import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { IOrderProduct, OrderDetails } from 'src/app/interfaces/DB_Models';

@Component({
  selector: 'app-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , TranslateModule]
})
export class QuantityInputComponent  implements OnInit,OnDestroy {

 @Input('detail') detail? : OrderDetails | IOrderProduct ;

 @Output('quantityChange') quantityChange:EventEmitter<IOrderProduct> = new EventEmitter<IOrderProduct>();

 subMesHeader?:Subscription;
 mesHeader?:string;

 subMesContent?:Subscription;
 mesContent?:string;

  constructor(private alertController: AlertController,
                      private translate: TranslateService           
  ) {

    addIcons({arrowDownCircleOutline,arrowUpCircleOutline});

    this.subMesHeader = this.translate.get('order.message_quan').subscribe((text)=>{
      this.mesHeader! = text;
     });

     this.subMesContent = this.translate.get('order.max_quan_req').subscribe((text)=>{
      this.mesContent! = text;
     });

   }



  ngOnDestroy(): void {

   if(this.subMesContent!)
    this.subMesContent!.unsubscribe();

   if(this.subMesHeader!)
    this.subMesHeader!.unsubscribe();

  }

  ngOnInit() {}

  get quantity():number {
      return this.orderProductProperty.quan_req!;
  }
 
  get maxQuan():number {
    return this.orderProductProperty.max_limit!;
  }

  private get orderProductProperty() : IOrderProduct{
    const orderProduct =  this.detail! instanceof OrderDetails ?  this.detail!.orderProduct! : this.detail!;
    return orderProduct;
  }

  private setQuantity(quan:number):void{
    this.orderProductProperty.quan_req = quan;
    this.quantityChange.emit(this.orderProductProperty);
  }

  increment(){
    if(this.quantity < this.maxQuan || this.maxQuan === 0){
      this.setQuantity(this.quantity+1);
    }else
    {
      this.presentAlert();
    }
  }

  decrement(){
    const quan_d = this.quantity > 1 ? this.quantity - 1 : 1 ;
    this.setQuantity(quan_d);
  }

  async inputQuantity(){
        const alert = await this.alertController.create({
          header: this.mesHeader!,
          inputs: [
          {
              name: 'quanValue',
              type: 'number',
              value: this.quantity
          }],    
          buttons: [
              {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: () => {
                      console.log('Confirm Cancel');
                  }
              }, 
              {
                  text: 'Ok',
                  handler: (alertData) => { 
                    if(alertData.quanValue > this.maxQuan)
                      this.presentAlert();
                    else{
                      const quanAlert = alertData.quanValue ;
                      this.setQuantity(quanAlert);
                    }
                  }
              }
          ]
      });
      await alert.present();
  }

  async presentAlert( ) {
    const alert = await this.alertController.create({
      header: this.mesHeader!,
      subHeader: '',
      message: `${this.mesContent! + ' ' + this.maxQuan}`,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
