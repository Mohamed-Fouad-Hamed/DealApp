import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IonicModule  } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SingleItem } from 'src/app/types/types';
import { APIService } from 'src/app/services/API/api.service';

@Component({
  selector: 'app-popover-select',
  templateUrl: './popover-select.component.html',
  styleUrls: ['./popover-select.component.scss'],
  standalone:true,
  imports: [IonicModule, CommonModule , FormsModule]
})
export class PopoverSelectComponent  implements OnInit {

  @Input() title: string = ""
  @Input() items?:SingleItem[] = [];
 
  filteredItems?: SingleItem[] = [];
  
  public searchTerm = '';

  apiServer:string = '';

  constructor(private popoverController: PopoverController, private api:APIService ) { }

  ngOnInit() {
    this.apiServer = this.api.apiHost;
    this.filteredItems! = [...this.items!]
  }

  trackItems(index: number, item: SingleItem) {
    return item.id;
  }

  searchbarInput(ev:any) {
    this.filterList(ev.target.value);
  }


  filterList(searchQuery: string | undefined) {
  
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items!];
    } else {
     
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items!.filter((item) => {
        return item.name.toLowerCase().includes(normalizedQuery);
      });
    }
  }

  selectItem(item:SingleItem) {
    this.popoverController.dismiss({
      'selectedItem': item
    });
  }
  
}

