import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.page.html',
  styleUrls: ['./list-suppliers.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListSuppliersPage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('List suppliers oninit ... ');
  }

}
