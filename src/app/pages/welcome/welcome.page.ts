import { Component, ElementRef, OnInit , ViewChild,  inject   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { ITokenLogin } from 'src/app/services/interfaces/Auth-Interfaces';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatabaseService } from 'src/app/services/Database-services/database.service';
import { StartPage } from '../start/start.page';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,StartPage,RouterLink,IonRouterLink],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomePage implements OnInit {

  //  authentication service

  private authService = inject(AuthenticationService);

  private router = inject(Router);

  // database service
  private databaseService = inject(DatabaseService);

  private users = this.databaseService.getUsers;
  

  

  constructor() { 
   
    //effect(()=>{console.log('users changes' , this.users())});
   
  }


  ngOnInit() {

   
    this.databaseService.fetchFirstUser().then((user)=>{
      
      if(user.id == 1){

        const iTokenLogin : ITokenLogin = { token : user.token};

        this.authService.authByToken(iTokenLogin).subscribe((res)=>{ 
  
           console.log(res);
  
           if(res.status == 200){
  
             this.databaseService.updateUserById(''+user.id ,res.entity.token);
             
             this.authService.setAuthUser(res.entity);
              
              this.router.navigate(['/home/notifications']);
            }
  
          });
        }
      }
    );
    
  }

 

}
