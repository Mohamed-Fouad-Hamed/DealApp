import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {  IonRouterLink } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { IUserResponse } from 'src/app/services/interfaces/Auth-Interfaces';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule,RouterLink,IonRouterLink,TranslateModule]
})
export class MainMenuComponent  implements OnInit {

  @Input('textMenu') textMenu? : string ;
  @Input('hasBackButton') hasBackButton? : boolean ;

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
