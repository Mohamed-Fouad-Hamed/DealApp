import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainMenuComponent } from 'src/app/components/main-menu/main-menu.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-suppliers-page',
  templateUrl: './suppliers-page.page.html',
  styleUrls: ['./suppliers-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , MainMenuComponent , TranslateModule]
})
export class SuppliersPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
