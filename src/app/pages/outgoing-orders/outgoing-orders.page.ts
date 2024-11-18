import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-outgoing-orders',
  templateUrl: './outgoing-orders.page.html',
  styleUrls: ['./outgoing-orders.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OutgoingOrdersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
