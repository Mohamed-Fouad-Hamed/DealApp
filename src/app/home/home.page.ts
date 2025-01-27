import { Component, inject, OnDestroy, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {  IonRouterLink } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { OrderService } from '../services/model-services/order/order.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';





@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,IonRouterLink,RouterLink,TranslateModule]
})

export class HomePage implements OnInit , OnDestroy{

   titleHomePage:string = 'app_menu.main';

   mainPage : string = 'main-page';
   cartPage : string = 'cart-page';
   suppliersPage : string = 'suppliers-page';
   offerSuppliersPage : string = 'offer-suppliers-page';

  
   countOrders:number=0;

   private orderService = inject(OrderService);
   private orderServiceSubscription?:Subscription ;

  constructor() { 
    addIcons({
      
    })
  }
  ngOnDestroy(): void {
    if(this.orderServiceSubscription)
      this.orderServiceSubscription!.unsubscribe();
  }

  async ngOnInit() {
    this.orderServiceSubscription! = this.orderService.getOrdersBehaviorSubject.subscribe(
      orders => this.countOrders = orders.length
    );
  }

 
}
