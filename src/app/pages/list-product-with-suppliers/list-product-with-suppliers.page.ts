import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-list-product-with-suppliers',
  templateUrl: './list-product-with-suppliers.page.html',
  styleUrls: ['./list-product-with-suppliers.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListProductWithSuppliersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
