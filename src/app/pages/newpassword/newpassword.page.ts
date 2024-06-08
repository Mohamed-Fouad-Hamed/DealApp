import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { INewPassword } from 'src/app/services/interfaces/Auth-Interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router ,RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { MatchPasswordDirective } from '../../validations/directives/MatchPasswordDirective';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.page.html',
  styleUrls: ['./newpassword.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,IonRouterLink, RouterLink , MatchPasswordDirective,TranslateModule]
})
export class NewpasswordPage implements OnInit {

  @ViewChild('newPasswordForm') public newPasswordFrm!: NgForm;

  private authService = inject(AuthenticationService);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private iNewPassword : INewPassword = {login: '',password: ''} ;

  public passwordForm = {password:'' , confirmPassword:''} ;

  private login! : string | null;

  public isLoading : boolean = false ;

  passwordHide : boolean = true ;

  confirmPasswordHide : boolean = true ;

  error:string ='';

  constructor() { }

  ngOnInit() {
    this.route.paramMap.subscribe((params)=>{

      this.login = params.get('id');

    })
  }


  async createNewPassword(){

    this.isLoading = true;
    
    this.iNewPassword =  { login:this.login! , password: this.passwordForm.password } ;
    
    try{
   
      await this.authService.updatePassword(
             this.iNewPassword
        ).subscribe({ next: (res) => {
         
          if(res.status == 201){
              this.router.navigate(['/login']);
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

}
