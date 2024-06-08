import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IVerifyOTP } from 'src/app/services/interfaces/Auth-Interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IonRouterLink } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verfiy-reset-password-otp',
  templateUrl: './verfiy-reset-password-otp.page.html',
  styleUrls: ['./verfiy-reset-password-otp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,IonRouterLink, RouterLink,TranslateModule]
})
export class VerfiyResetPasswordOtpPage implements OnInit {

  private authService = inject(AuthenticationService);

  private router = inject(Router);

  private route = inject(ActivatedRoute);
  
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

  }

  async verfiyOtp(){

    this.isLoading = true;
    this.iVerfiyOtp.login = this.login!;
    try{

      

        await this.authService.verfiyOTPResetPassword(
                                             this.iVerfiyOtp
                                            ).pipe(
                                              finalize(()=>{ setInterval(()=>{this.isLoading=false;},2000);})
                                            ).subscribe({ next: (res) => {
                                                    if(res.status === 200){
                                                      this.router.navigate([`/newpassword/${this.login}`]);
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
