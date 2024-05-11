import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl,ReactiveFormsModule, FormGroup, FormsModule, Validators, AbstractControl, ValidationErrors, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LANGUAGES, Language } from 'src/app/services/interfaces/Languages';
import { ISignup } from 'src/app/services/interfaces/Auth-Interfaces';
import { RegexPatternDirective } from 'src/app/validations/directives/regexPatternDirective';
import { IsUniqueValidatorDirective } from 'src/app/validations/directives/AsyncIsUniqueDirective';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule,IonRouterLink,RouterLink,RegexPatternDirective ,IsUniqueValidatorDirective]
})

export class RegisterPage implements OnInit {

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
     
        await this.authService.userRegister(
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
