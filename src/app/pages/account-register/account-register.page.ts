import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { LANGUAGES, Language } from 'src/app/services/interfaces/Languages';
import { IAccountSignup } from 'src/app/services/interfaces/Auth-Interfaces';
import { RegexPatternDirective } from 'src/app/validations/directives/regexPatternDirective';
import { IsUniqueValidatorDirective } from 'src/app/validations/directives/AsyncIsUniqueDirective';
import { finalize } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-account-register',
  templateUrl: './account-register.page.html',
  styleUrls: ['./account-register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,ReactiveFormsModule,IonRouterLink,TranslateModule,RouterLink,RegexPatternDirective ,IsUniqueValidatorDirective]
})
export class AccountRegisterPage implements OnInit {

  @ViewChild('registerForm') public registerFrm!: NgForm;
 
  private authService = inject(AuthenticationService);

  private router = inject(Router);

  isLoading : boolean = false ;

  error:string = '0';

  hide = true;

  appLanguages:Language[] = [];

  accountSignUp:IAccountSignup = { 
                account_type: 0,
                account_name:'',
                firstName:'',
                lastName:'',
                email:'',
                login:'',
                password:'',
                s_cut:''
  };

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
     
        await this.authService.accountRegister(
              this.registerFrm.value
          ).pipe( finalize(() => {
                  setInterval(
                    ()=>{
                      this.isLoading=false;
                    }
                    ,2000
                  );
          }) )
          .subscribe({ next: (res) => {
           
            if(res.status === 200){
                const userToken = res.entity.token ;
                this.router.navigate([`/verfiy-otp/${this.accountSignUp.login}`]);
             }
            
           }
           ,error:(err)=>{ this.error = err.message }} 
          );
  
      }catch( e:any){
        this.error = e.message;
      
      }
  
     
    }
  
    onReset(): void {
      this.registerFrm.reset();
    }

}
