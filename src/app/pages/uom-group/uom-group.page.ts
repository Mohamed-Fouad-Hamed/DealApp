import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-uom-group',
  templateUrl: './uom-group.page.html',
  styleUrls: ['./uom-group.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UomGroupPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
