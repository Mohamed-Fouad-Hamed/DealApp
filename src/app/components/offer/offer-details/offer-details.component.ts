import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IOfferDetailsReq } from 'src/app/interfaces/DB_Models';


@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class OfferDetailsComponent  implements OnInit {


  offerDetails : IOfferDetailsReq = {
     id : 0 ,
     product_id : 0 ,
     unit : '',
     max_quan : 0,
     max_limit : 0,
     percent_discount : 0 ,
     price : 0,
     o_price : 0  
  };


  constructor() { }

  ngOnInit() {}

}
