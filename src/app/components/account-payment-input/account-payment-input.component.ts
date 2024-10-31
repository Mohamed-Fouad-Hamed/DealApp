import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAccountPayment, IPayment } from 'src/app/services/interfaces/Auth-Interfaces';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'account-payment-input',
  templateUrl: './account-payment-input.component.html',
  styleUrls: ['./account-payment-input.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class AccountPaymentInputComponent  implements OnInit {

  @Input('paymentTypes') paymentTypes : IPayment[] = [];

  @Input('accountPayment') accountPayment? :IAccountPayment;

  @Input('enableType') enableType :boolean = false;

  @Output('updateAccountPayment') updateAccountPayment = new EventEmitter<IAccountPayment>(); 

  @Output('cancelUpdate') cancelUpdate = new EventEmitter<void>(); 

  
  isLoading:boolean = false ;

  constructor() { }

  ngOnInit() {}

  submit(){
    this.updateAccountPayment.emit(this.accountPayment);
  }

  cancel(){
     this.cancelUpdate.emit();
  }

}
