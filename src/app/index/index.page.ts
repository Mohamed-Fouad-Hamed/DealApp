import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,IonRouterOutlet]
})
export class IndexPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
