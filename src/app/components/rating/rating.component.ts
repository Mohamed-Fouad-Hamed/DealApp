import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';

@Component({
  selector: 'rating-view',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports:[  CommonModule ]
})
export class RatingComponent  implements OnInit {

 @Input('rating') rating:number = 0;

  constructor() { }

  ngOnInit() {}

  get percent() {

    let result = 'inset(0 0 0 100%)';

    if(this.rating <= 0){

      if(document.dir !== 'rtl')
         return 'inset(0 100% 0 0)';  
      else
         return result;
    }

    const size = this.rating/5*100;
    
    if(document.dir !== 'rtl')
      result = `inset(0 ${100-size}\% 0 0)`;
    else
      result = `inset(0 0 0 ${100-size}\%)`;
   
    
    return result ;
  }

}
