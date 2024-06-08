import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController } from '@ionic/angular';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';
import { IUserResponse } from 'src/app/services/interfaces/Auth-Interfaces';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class UserProfilePage implements OnInit {

  private login : string = '';

  private route = inject(ActivatedRoute);

  public avatarUrl:string ='';

  public imageUrl:string ='';

  public currentUser? : IUserResponse  = {
    id: 0, firstName: '', lastName: '',
    email: '',
    login: '',
    s_cut: '',
    token: '',
    user_avatar: '',
    user_image: '',
    isOtpRequired: false,
    account_id: 0,
    account_name: '',
    account_logo: '',
    account_image: ''
  };

  constructor(
    private apiService:APIService,
    private authService:AuthenticationService,
    private modalCtrl: ModalController) { }

 async  ngOnInit() {

    this.route.paramMap.subscribe((params)=>{
      this.login = params.get('id') || '';
    });
 

    this.authService.getUser(this.login).pipe(finalize(() => {
      console.log("  finally ... ")
    })).subscribe(
      (res)=> {
        this.currentUser = res;
        this.avatarUrl = `${this.apiService.apiHost}${this.currentUser?.user_avatar}` 
        this.imageUrl = `${this.apiService.apiHost}${this.currentUser?.user_image}` ;
      }

    );
  }

  async openModalAvatar() {
    const modal = await this.modalCtrl.create({
      component: SelectImageComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.avatarUrl = '';
        const formData:FormData = new FormData();
        const fileName = `avatar-user.${data.type.split('\/')[1]}`;
        formData.append('avatar',data,fileName);
        formData.append('id',this.login);
        this.authService.userUploadAvatar(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res)=>{
          this.currentUser = res.entity;
          this.avatarUrl = `${this.apiService.apiHost}${this.currentUser?.user_avatar}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.avatarUrl = `${this.apiService.apiHost}${this.currentUser?.user_avatar}` 
        }});

    }
  }

  async openModalImage() {

    const modal = await this.modalCtrl.create({
      component: SelectImageComponent,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.imageUrl = '';
      const formData:FormData = new FormData();
        const fileName = `image-user.${data.type.split('\/')[1]}`;
        formData.append('image',data,fileName);
        formData.append('id',this.login);
        this.authService.userUploadImage(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res)=>{
          this.currentUser = res.entity;
          this.imageUrl = `${this.apiService.apiHost}${this.currentUser?.user_image}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.imageUrl = `${this.apiService.apiHost}${this.currentUser?.user_image}` 
        }});
    }
  }

}
