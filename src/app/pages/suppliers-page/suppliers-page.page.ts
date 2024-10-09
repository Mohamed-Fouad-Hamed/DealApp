import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SupplierCardComponent } from 'src/app/components/supplier-card/supplier-card.component';

@Component({
  selector: 'app-suppliers-page',
  templateUrl: './suppliers-page.page.html',
  styleUrls: ['./suppliers-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule  , TranslateModule, SupplierCardComponent]
})
export class SuppliersPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  supplierClicked(){
    console.log("Supplier clicked .... ")
  }
}
