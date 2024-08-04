import { Component, OnDestroy, OnInit , ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { ICredential } from 'src/app/services/interfaces/Auth-Interfaces';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
//import { DatabaseService } from 'src/app/services/Database-services/database.service';
import { TranslateModule } from '@ngx-translate/core';
import { RegexPatternDirective } from 'src/app/validations/directives/regexPatternDirective';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule , TranslateModule ,RouterLink,IonRouterLink , RegexPatternDirective]
})
export class LoginPage implements OnInit , OnDestroy{

  @ViewChild('loginForm') public loginFrm!: NgForm;

  private subscription!: Subscription;

  private authService = inject(AuthenticationService);

  private router = inject(Router);

 // private databaseService = inject(DatabaseService);
  
  public credential : ICredential = {login:'',password:'',rememberMe:false};

  public isLoading : boolean = false ;

  public error:string = '';

  hide = true;

  submitted = false;



  constructor() { 
   
  }


  ngOnInit() {


  }



async  onSubmit() {
    this.submitted = true;

    if (this.loginFrm.invalid) {
      return;
    }

    this.isLoading = true;
    
    try{
   
      this.subscription = this.authService.login(
            this.loginFrm.value
        ).subscribe({ next: (res) => {
         
          if(res.status == 200){

              const userToken = res.entity.token ;
            /*
              const users = this.databaseService.getUsers();
            
              if(users().length > 0){

                this.databaseService.updateUserById("1",userToken);

                this.error="update"

              }else{

                const curLogin = res.entity.login ;

                const userName = res.entity.firstName + ' ' + res.entity.lastName;
                
                this.databaseService.addUser(curLogin , userName , userToken);
                
                this.error="insert"
              }
             */

              this.authService.setAuthentication(true);
              this.authService.setAuthUser(res.entity);

              const {id} = res?.entity;

              this.router.navigate(['/home/notifications']);
          }
          
         }
         ,error:(err)=>{ this.error = err.message }} 
        );

    }catch( e:any){
      this.error = e.message;
      console.log(e)
    }finally{ 
      setInterval(()=>{this.isLoading=false;},2000);
    }

  
  }

  onReset(): void {
    this.submitted = false;
    this.loginFrm.reset();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
 }


}
