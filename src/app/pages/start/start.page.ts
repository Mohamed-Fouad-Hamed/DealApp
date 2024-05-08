import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {  IonRouterLink, Platform } from '@ionic/angular/standalone';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { APIService } from 'src/app/services/API/api.service';


@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,IonRouterLink,RouterLink]
})
export class StartPage implements OnInit {

  public authURL:string = 'Current authentication URL';
  private authService = inject(AuthenticationService);
  


  constructor() {

   }

  ngOnInit() {

    this.authURL = this.authService.authUrl;

  }



}
