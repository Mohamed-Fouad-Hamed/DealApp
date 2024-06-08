import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import {  IonRouterLink } from '@ionic/angular/standalone';
import { AuthenticationService } from '../services/Auth-services/authentication.service';
import { IDBUser } from '../interfaces/DB_Models';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,IonRouterLink,RouterLink]
})

export class HomePage implements OnInit {

  private authService = inject(AuthenticationService);
  
   user : IDBUser = { id : 0,login :'',name:'',token:'' } ;

   titleHomePage:string = 'Notification'

  constructor() { }

  ngOnInit() {
    this.authService.getAuthUser.subscribe((user)=>{
      this.user = user
    });
  }

 
}
