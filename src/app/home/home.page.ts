import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {  IonRouterLink } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';




@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,IonRouterLink,RouterLink,TranslateModule]
})

export class HomePage implements OnInit {

   titleHomePage:string = 'app_menu.main';

   mainPage : string = 'main-page';
   cartPage : string = 'cart-page';
   suppliersPage : string = 'suppliers-page';
   offerSuppliersPage : string = 'offer-suppliers-page';

  constructor() { }

  async ngOnInit() {
  

  }

 
}
