import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EvaluationColors } from 'src/app/types/enums';

@Component({
  selector: 'input-rating',
  templateUrl: './input-rating.component.html',
  styleUrls: ['./input-rating.component.scss'],
  standalone:true,
  imports:[CommonModule]
})
export class InputRatingComponent  {

  @Input() rating: number | undefined ;

  @Output() ratingChange: EventEmitter<number> = new EventEmitter();;

  constructor() {}

  rate(index: number) {
      this.rating = index;
      this.ratingChange.emit(this.rating);
   }

  getColor(index: number) {
     if(this.isAboveRating(index)){
      return EvaluationColors.GREY;
     }
     switch(this.rating!){
      case 1:
      case 2:
        return EvaluationColors.RED;
      case 3:
        return EvaluationColors.YELLOW;
      case 4:
      case 5:
        return EvaluationColors.GREEN;
      default:
        return EvaluationColors.GREY;      

     }
    }

  isAboveRating(index: number): boolean {
    return index > this.rating!;
  }

}

