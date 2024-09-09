import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainMenuComponent } from 'src/app/components/main-menu/main-menu.component';
@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.page.html',
  styleUrls: ['./list-suppliers.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,MainMenuComponent]
})
export class ListSuppliersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
