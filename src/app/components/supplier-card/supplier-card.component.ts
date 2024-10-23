import { Component, input, OnInit ,effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RatingComponent } from '../rating/rating.component';
import { IAccountResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { InputRatingComponent } from '../input-rating/input-rating.component';

@Component({
  selector: 'app-supplier-card',
  templateUrl: './supplier-card.component.html',
  styleUrls: ['./supplier-card.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule,RatingComponent,InputRatingComponent]
})
export class SupplierCardComponent  implements OnInit {

  rating:number = 1 ;

  supplier = input.required<IAccountResponse>();

  public currentAccount?:IAccountResponse = {
    id : 0 ,
    account_type:'',
    account_name:'',
    account_logo :'',
    account_image:'',
    min_value:0,
    min_quan:0,
    credit:0,
    rating:0,
    delivery_period : '',
    weekend  : '',
    work_hours  : ''
  }

  constructor() {  
    effect(()=>{
      this.currentAccount = this.supplier();
    });
   }

  ngOnInit() {

      
  }


  ratingChange(v:any){
     console.log(v)
  }

}
