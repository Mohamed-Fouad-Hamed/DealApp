import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { IAccountOfferRes } from 'src/app/interfaces/DB_Models';
import { format } from 'date-fns/format';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule ,TranslateModule]
})
export class OfferViewComponent  implements OnInit {

  @Input() offer? : IAccountOfferRes ; 

   endAt:string ='';

  constructor() { }

  ngOnInit() {
    this.endAt = format( this.offer?.endAt! ,'yyyy/MM/dd');
  }



}
