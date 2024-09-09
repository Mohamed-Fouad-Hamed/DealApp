import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {  IonRouterLink } from '@ionic/angular/standalone';
import { AuthenticationService } from '../services/Auth-services/authentication.service';
import { IUserResponse } from '../services/interfaces/Auth-Interfaces';
import { TranslateModule } from '@ngx-translate/core';




@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,IonRouterLink,RouterLink,TranslateModule]
})

export class HomePage implements OnInit {

  private authService = inject(AuthenticationService);
  
  accountProductsUrl?:string;
  accountOfferUrl?:string;
  accountProfile?:string;
  
   user : IUserResponse = 
   { 
    id : 0,
    firstName:'',
    lastName:'',
    email:'',
    login:'',
    s_cut:'',
    token:'',
    user_avatar:'',
    user_image:'',
    isOtpRequired:false,
    account_id:0,
    account_name:'',
    account_logo:'',
    account_image:'',
    account_type:'' 
  } ;

   titleHomePage:string = 'app_menu.main';

   mainPage : string = 'main-page';
   cartPage : string = 'cart-page';
   suppliersPage : string = 'suppliers-page';
   offerSuppliersPage : string = 'offer-suppliers-page';

  constructor() { }

  async ngOnInit() {
  
    this.authService.getUserAuth().subscribe((oUser)=>{
      this.user = oUser;
      this.accountProductsUrl! = `/account-product-list/${this.user.account_id}`;
      this.accountOfferUrl! = `/account-offer/${this.user.account_id}`;
      this.accountProfile! = `/account-profile/${this.user.account_id}`;;
    });
    

  }

 
}
