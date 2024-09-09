import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-offer-suppliers-page',
  templateUrl: './offer-suppliers-page.page.html',
  styleUrls: ['./offer-suppliers-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class OfferSuppliersPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
