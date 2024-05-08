import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { LANGUAGES, Language } from 'src/app/services/interfaces/Languages';
import { ISignup } from 'src/app/services/interfaces/Auth-Interfaces';

@Component({
  selector: 'app-account-register',
  templateUrl: './account-register.page.html',
  styleUrls: ['./account-register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AccountRegisterPage implements OnInit {

  @ViewChild('registerForm') public registerFrm!: NgForm;
 
  private authService = inject(AuthenticationService);

  private router = inject(Router);

  isLoading : boolean = false ;

  error:string = '0';

  hide = true;

  appLanguages:Language[] = [];

  signUp:ISignup = {firstName:'',lastName:'',email:'',login:'',password:'',s_cut:''};

  constructor() { }

  ngOnInit() {
    this.appLanguages = LANGUAGES;
  }



  async  onSubmit() {

      if (this.registerFrm.invalid) {
        return;
      }
  
      this.isLoading = true;
      
      try{
     
        await this.authService.register(
              this.registerFrm.value
          ).subscribe({ next: (res) => {
           
            if(res.status === 200){
                const userToken = res.entity.token ;
                this.router.navigate([`/verfiy-otp/${this.signUp.login}`]);
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
      this.registerFrm.reset();
    }

}
