import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonicModule ,IonInput } from '@ionic/angular';

import { APIService } from 'src/app/services/API/api.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; 
import { Item } from 'src/app/types/types';

@Component({
  selector: 'app-multi-selection-search',
  templateUrl: './multi-selection-search.component.html',
  styleUrls: ['./multi-selection-search.component.scss'],
  standalone:true,
  imports: [IonicModule, CommonModule,TranslateModule]
})
export class MultiSelectionSearchComponent  implements OnInit,AfterViewInit {

  @Input() items: Item[] = [];
  @Input() selectedItems: string[] = [];
  @Input() title = 'Select Items';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() searchEmit = new EventEmitter<string>();

  @ViewChild('inputSearch') input!: IonInput;

  workingSelectedValues: string[] = [];

  apiServer:string = '';

  msg:string = 'accountproduct.addnotallow' ;

  constructor(private api:APIService){}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.input.setFocus();
    }, 500);
  }


  ngOnInit() {
    this.workingSelectedValues = [...this.selectedItems];
    this.apiServer = this.api.apiHost;
  }

  trackItems(index: number, item: Item) {
    return item.value;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValues);
  }

  searchbarInput(ev:any) {
    this.searchEmit.emit(ev.target.value);
  }

 

  isChecked(value: string) {
    return this.workingSelectedValues.find((item) => item === value);
  }

  checkboxChange(ev:any) {
    const { checked, value } = ev.detail;

    if (checked) {
      this.workingSelectedValues = [...this.workingSelectedValues, value];
    } else {
      this.workingSelectedValues = this.workingSelectedValues.filter((item) => item !== value);
    }
  }
}