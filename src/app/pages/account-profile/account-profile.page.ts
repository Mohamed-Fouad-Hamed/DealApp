import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule , ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/API/api.service';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { IAccountOptionReq, IAccountResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { Subscription, finalize } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.page.html',
  styleUrls: ['./account-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class AccountProfilePage implements OnInit , OnDestroy{

  @ViewChild('accountOptionFrm') public accountOptionFrm!: NgForm;

  private id : string = '';

  private route = inject(ActivatedRoute);

  public logoUrl:string ='';

  public imageUrl:string ='';

  err:string = '';

  isLoading:boolean = false;
  isToastOpen:boolean =false;

  public currentAccount?:IAccountResponse = {
    id : 0 ,
    account_type:'',
    account_name:'',
    account_logo :'',
    account_image:'',
    min_value:0,
    min_quan:0,
    credit:0,
    rating:0,
    delivery_period : '',
    weekend  : '',
    work_hours  : ''
  }

  accountOption:IAccountOptionReq = {
    id : 0 ,
    min_value:0,
    min_quan:0,
    currency:'ج.م',
    credit:0,
    rating:0,
    delivery_period : '',
    weekend  : '',
    work_hours  : ''
  }

  private subscriptionRoute?:Subscription;
  private subscription? : Subscription;
  private updateAccountOptionSubscription? : Subscription;
  private logoSubscription? : Subscription;
  private imageSubscription? : Subscription;

  constructor (
    private apiService:APIService,
    private authService:AuthenticationService,
    private modalCtrl: ModalController
  ) { }


  ngOnDestroy(): void {
    if(this.subscriptionRoute!) this.subscriptionRoute!.unsubscribe();
    if(this.subscription!) this.subscription!.unsubscribe();
    if(this.logoSubscription!) this.logoSubscription!.unsubscribe();
    if(this.imageSubscription!) this.imageSubscription!.unsubscribe();
    if(this.updateAccountOptionSubscription!) this.updateAccountOptionSubscription!.unsubscribe();
  }


  ngOnInit() {

     this.subscriptionRoute = this.route.paramMap.subscribe((params)=>{
      this.id = params.get('accountId') || '' ;
      this.accountOption.id = +this.id;
    });
    
   this.subscription = this.authService.getAccount(this.id).pipe(finalize(() => {
      console.log("  finally ... ")
    })).subscribe(
      (res:any)=> {
        this.currentAccount = res;
        this.accountOption.min_value = this.currentAccount!.min_value;
        this.accountOption.min_quan = this.currentAccount!.min_quan;
        this.accountOption.currency = res.currency;
        this.accountOption.delivery_period = this.currentAccount!.delivery_period;
        this.accountOption.weekend = this.currentAccount!.weekend;
        this.accountOption.work_hours = this.currentAccount!.work_hours;

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
        formData.append('image',data,fileName);
        formData.append('id', this.id);
        console.log(this.id)
       this.logoSubscription = this.authService.accountUploadLogo(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res:any)=>{
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
        formData.append('image',data,fileName);
        formData.append('id',this.id);
        this.imageSubscription = this.authService.accountUploadImage(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res:any)=>{
          this.currentAccount = res.entity;
          this.imageUrl = `${this.apiService.apiHost}${this.currentAccount?.account_image}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.imageUrl = `${this.apiService.apiHost}${this.currentAccount?.account_image}` 
        }});
    }
  }

  async updateAccountOption(){

    if (this.accountOptionFrm.invalid) {
      return;
    }

    this.isLoading = true;
    
    try{
   
    this.subscription =  this.authService.updateAccountOption(
        this.accountOption
      ).pipe(finalize(() => {
        setInterval(
          () => {
            this.isLoading = false;
          },
          2000
        );
      }))
        .subscribe({
          next: (res) => {
            
            if (res.status === 200) {
               this.setOpenToast(true)
            
            }

          },
          error: (err) => { console.log(err); this.err = err.message; }
        }
        );

    }catch( e:any){
      this.err = e.message;
    
    }


  }

  setOpenToast(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
