import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-incoming-orders',
  templateUrl: './incoming-orders.page.html',
  styleUrls: ['./incoming-orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IncomingOrdersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
