import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Item } from 'src/app/types/types';
import { IonicModule ,IonInput } from '@ionic/angular';

import { APIService } from 'src/app/services/API/api.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({
  selector: 'app-single-selection-search',
  templateUrl: './single-selection-search.component.html',
  styleUrls: ['./single-selection-search.component.scss'],
  standalone:true,
  imports: [IonicModule, CommonModule,TranslateModule]
})
export class SingleSelectionSearchComponent  implements OnInit,AfterViewInit {

  @Input() items: Item[] = [];

  @Input() title = 'Select Items';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<Item>();
  @Output() searchEmit = new EventEmitter<string>();


  @ViewChild('inputSearch') input!: IonInput;

  selectedItem?:Item;

  apiServer:string = '';

 constructor(private api:APIService){}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.input.setFocus();
    }, 500);
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
    this.searchEmit.emit(ev.target.value);
  }

  compareWith(o1:any, o2:any) {
    return o1.id === o2.id;
  }

  get directionRight(){
    return document.dir==='rtl';
  }

}
