import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/API/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IAccountResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { finalize } from 'rxjs';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.page.html',
  styleUrls: ['./account-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AccountProfilePage implements OnInit {

  private id : string = '1';

  private route = inject(ActivatedRoute);

  public logoUrl:string ='';

  public imageUrl:string ='';

  public currentAccount?:IAccountResponse = {
    id:0 ,
    account_type:'',
    account_name:'',
    account_logo :'',
    account_image:''
  }

  constructor( 
    private apiService:APIService,
    private authService:AuthenticationService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {


    this.route.paramMap.subscribe((params)=>{
      this.id = params.get('id') || '' ;
    });
    
    this.id = '1'

    this.authService.getAccount(this.id).pipe(finalize(() => {
      console.log("  finally ... ")
    })).subscribe(
      (res)=> {
        this.currentAccount = res;
        this.logoUrl = `${this.apiService.apiHost}${this.currentAccount?.account_logo}` 
        this.imageUrl = `${this.apiService.apiHost}${this.currentAccount?.account_image}` ;
      }

    );

  }


  async openModalLogo() {
    const modal = await this.modalCtrl.create({
      component: SelectImageComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.logoUrl = '';
        const formData:FormData = new FormData();
        const fileName = `logo-account.${data.type.split('\/')[1]}`;
        this.id='1'
        formData.append('image',data,fileName);
        formData.append('id', this.id);
        this.authService.accountUploadLogo(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res)=>{
          this.currentAccount = res.entity;
          this.logoUrl = `${this.apiService.apiHost}${this.currentAccount?.account_logo}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.logoUrl = `${this.apiService.apiHost}${this.currentAccount?.account_logo}` 
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
        const fileName = `image-account.${data.type.split('\/')[1]}`;
        this.id='1'
        formData.append('image',data,fileName);
        formData.append('id',this.id);
        this.authService.accountUploadImage(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res)=>{
          this.currentAccount = res.entity;
          this.imageUrl = `${this.apiService.apiHost}${this.currentAccount?.account_image}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.imageUrl = `${this.apiService.apiHost}${this.currentAccount?.account_image}` 
        }});
    }
  }


}
