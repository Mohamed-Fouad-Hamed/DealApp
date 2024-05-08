import { Component, OnInit , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { ICredential } from 'src/app/services/interfaces/Auth-Interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';
import { forbiddenNameValidator } from 'src/app/validations/regexValidation';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule,RouterLink,IonRouterLink]
})
export class LoginPage implements OnInit {

  private authService = inject(AuthenticationService);

  private router = inject(Router);

  private databaseService = inject(DatabaseService);
  
  public credential : ICredential = {login:'',password:'',rememberMe:false};

  public isLoading : boolean = false ;

  public error:string = '';

  hide = true;

  form! : FormGroup ;

  submitted = false;



  constructor() { 
}

  ngOnInit() {

      this.form =  new FormGroup({
        login: new FormControl( this.credential.login ,[Validators.required,Validators.maxLength(50),forbiddenNameValidator(/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|\d+$/)]),
        password: new FormControl( this.credential.password,[Validators.required , Validators.maxLength(20),Validators.minLength(6)]),
        rememberMe: new FormControl(this.credential.rememberMe)
      });

      this.form.valueChanges.subscribe(()=> {
        console.log(this.form.get('login')?.errors)
        })
  }

get loginKey(){
  return this.form.get('login');
}

get secretWord(){
  return this.form.get('password');
}

async  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    
    try{
   
      await this.authService.login(
            this.form.value
        ).subscribe({ next: (res) => {

          console.log(res)
         
          if(res.status == 201){

              const userToken = res.entity.token ;
            
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

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

 


  loginBlur(){
   // console.log(this.inputLogin.nativeElement.value);

  }

}
