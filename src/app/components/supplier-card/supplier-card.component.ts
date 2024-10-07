import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-supplier-card',
  templateUrl: './supplier-card.component.html',
  styleUrls: ['./supplier-card.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule]
})
export class SupplierCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
