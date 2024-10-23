import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
      return COLORS.GREY;
     }
     switch(this.rating!){
      case 1:
      case 2:
        return COLORS.RED;
      case 3:
        return COLORS.YELLOW;
      case 4:
      case 5:
        return COLORS.GREEN;
      default:
        return COLORS.GREY;      

     }
    }

  isAboveRating(index: number): boolean {
    return index > this.rating!;
  }

}

enum COLORS{
  GREY="#E0E0E0",
  GREEN="#76FF03",
  YELLOW="#FFCA28",
  RED="#DD2C00"
}