import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { DatabaseService } from 'src/app/services/database.service';
import { IVerifyOTP } from 'src/app/services/interfaces/Auth-Interfaces';
import { finalize } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-verfiy-otp',
  templateUrl: './verfiy-otp.page.html',
  styleUrls: ['./verfiy-otp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,IonRouterLink, RouterLink , TranslateModule]
})
export class VerfiyOtpPage implements OnInit {

  private authService = inject(AuthenticationService);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private databaseService = inject(DatabaseService);

 //  private urlService = inject(UrlService);
  
  public iVerfiyOtp : IVerifyOTP = {login: '',otp: ''} ;

  private login! : string | null;

  public isLoading : boolean = false ;

  error:string ='0';
  
  perviousRouter?:string = '';


  constructor() { }

  ngOnInit() {
   
    this.route.paramMap.subscribe((params)=>{

      this.login = params.get('id');

    });

    /*
    this.perviousRouter = this.urlService.getPreviousUrl();
    */
  }

  async verfiyOtp(){

    this.isLoading = true;

    this.iVerfiyOtp.login = this.login!;

    try{
        await this.authService.verfiyOTP(
                        this.iVerfiyOtp
                      ).pipe(
                        finalize(()=>setInterval(()=>{this.isLoading=false;},2000))
                      ).subscribe({ next: (res) => {
                          
                          if (res.status === 200){

                              const userToken = res.entity.token ;
                            
                              const users = this.databaseService.getUsers();
                               /*
                               
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
                                    this.router.navigate(['/home/notifications']);
                      
                              }
                              else 
                                    this.error ='otp code isn\'t verify';
                              
                              }
                              ,error:(err)=>{ this.error = err.message }} 
                            );  
                    }catch( e:any){
                      this.error = e.message;
                      console.log(e)
                    }

  }


}
