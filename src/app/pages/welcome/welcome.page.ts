import { Component, ElementRef, OnInit , ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ITokenLogin } from 'src/app/services/interfaces/Auth-Interfaces';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
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
  
  
  // swiper
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  public images=[
    'https://media.istockphoto.com/id/1425993030/photo/european-honey-bees-fly-around-apiary.webp?b=1&s=170667a&w=0&k=20&c=UjrXbrwYQZYMGvAg3x78ysHDrFNWYElKeywRN2rFYJA='
    ,'https://media.istockphoto.com/id/1486359843/photo/api-application-programming-interface-software-development-tool.webp?b=1&s=170667a&w=0&k=20&c=InbS19OIy9qvqhXwR4j99hXXe3MRxkc9lMvo7prTl9A='
    ,'https://media.istockphoto.com/id/1602192573/photo/bee-close-up-on-a-flower.webp?b=1&s=170667a&w=0&k=20&c=NCMEsmReAUYUNfFo_RWeshUSxJqvRuuVfB86KePTa_M='
    ,'https://images.unsplash.com/photo-1710104434504-0261d06fa832?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D'
    ,'https://images.unsplash.com/photo-1709828593321-48973262f23e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D'
    ,'https://images.unsplash.com/photo-1705499438100-fff66a0fce50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D'
  ];


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

             const userObservable = { id : user.id ,login:user.login,name:user.name, token: res.entity.token};
             
             this.authService.setAuthUser(userObservable);
              
              this.router.navigate(['/home/notifications']);
            }
  
          });
        }
      }
    );
    
  }

  onSlideChange(e:any){
    console.log('change : ' , e);
  }

  goNext(){
    this.swiperRef?.nativeElement.swiper.slideNext();
  }

  goPrev(){
    this.swiperRef?.nativeElement.swiper.slidePrev();
  }

}
