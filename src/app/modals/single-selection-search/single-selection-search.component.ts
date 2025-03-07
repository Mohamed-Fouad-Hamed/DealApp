import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Item } from 'src/app/types/types';
import { IonicModule ,IonInput } from '@ionic/angular';
import { InfiniteScrollCustomEvent } from '@ionic/core/components';
import { APIService } from 'src/app/services/API/api.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; 
//scrolling
import { ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-single-selection-search',
  templateUrl: './single-selection-search.component.html',
  styleUrls: ['./single-selection-search.component.scss'],
  standalone:true,
  imports: [IonicModule, CommonModule,TranslateModule,ScrollingModule]
})
export class SingleSelectionSearchComponent  implements OnInit,AfterViewInit {

  @Input() items: Item[] = [];
  @Input() selectedItems: string[] = [];
  @Input() title = 'Select Items';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<Item>();
  @Output() searchEmit = new EventEmitter<string>();
  @Output() infiniteScrollEmit = new EventEmitter<any>();

  @ViewChild('inputSearch') input!: IonInput;

  searchValue : string = '' ;

  selectedItem?:Item;

  apiServer:string = '';

 constructor(private api:APIService){}

  ngAfterViewInit(): void {
     this.focusInput();
  }

  focusInput(){
    setTimeout(() => {
      this.input.setFocus();
    }, 1000);
  }
 
  ngOnInit() {
    this.apiServer = this.api.apiHost;
  }

  trackItems(index: number, item: Item) {
    return item.value;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.selectedItem!);
  }

  selectItem(ev:any){
    this.selectedItem! = ev.target.value;
  }

  searchbarInput(ev:any) {
    this.searchValue = ev.target.value ;
    this.searchEmit.emit(this.searchValue);   
  }

  compareWith(o1:any, o2:any) {
    return o1.id === o2.id;
  }

  get directionRight(){
    return document.dir==='rtl';
  }

  onIonInfinite(ev:any) {
      
       if(this.searchValue === ''){
           (ev as InfiniteScrollCustomEvent).target.complete();
           return;
       }
          
       this.infiniteScrollEmit.emit(ev);
    }

}
