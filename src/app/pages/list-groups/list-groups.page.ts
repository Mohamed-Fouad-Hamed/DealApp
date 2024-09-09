import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainMenuComponent } from 'src/app/components/main-menu/main-menu.component';

@Component({
  selector: 'app-list-groups',
  templateUrl: './list-groups.page.html',
  styleUrls: ['./list-groups.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , MainMenuComponent]
})
export class ListGroupsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
