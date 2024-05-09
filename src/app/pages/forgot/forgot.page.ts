import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonRouterLink } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {  IUniqueLogin } from 'src/app/services/interfaces/Auth-Interfaces';
import { IsExistsValidatorDirective } from 'src/app/validations/directives/AsyncIsExistsDirective';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule  ,IonRouterLink , RouterLink , IsExistsValidatorDirective]
})
export class ForgotPage implements OnInit {

  @ViewChild('forgotForm') public forgotFrm!: NgForm;
 
  private authService = inject(AuthenticationService);

  private router = inject(Router);

  isLoading : boolean = false ;

  error:string = '0';

  hide = true;
 
  iUniqueLogin:IUniqueLogin = { id :''};

  constructor() { }

  ngOnInit() {
  }

  async  onSubmit() {

    if (this.forgotFrm.invalid) {
      return;
    }

    this.isLoading = true;
    
    try{
   
      await this.authService.forgetPassword(
            this.forgotFrm.value
        ).subscribe({ next: (res) => {
         
          if(res.status === 200){
              this.router.navigate([`/verfiy-otp/${this.iUniqueLogin.id}`]);
           }
          
         }
         ,error:(err)=>{ this.error = err.message }} 
        );

    }catch( e:any){
      this.error = e.message;
    
    }finally{ 
      setInterval(()=>{this.isLoading=false;},2000);
    }

   
  }

  onReset(): void {
    this.forgotFrm.reset();
  }

}