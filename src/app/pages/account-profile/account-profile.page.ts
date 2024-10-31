import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule , ModalController , AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/services/API/api.service';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { IAccountOptionReq, IAccountPayment, IAccountResponse, IPayment } from 'src/app/services/interfaces/Auth-Interfaces';
import { Subscription, finalize, map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';
import { AccountPaymentInputComponent } from 'src/app/components/account-payment-input/account-payment-input.component';
@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.page.html',
  styleUrls: ['./account-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule, AccountPaymentInputComponent]
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

  currentAccountPayment?:IAccountPayment;

  paymentTypes:IPayment[] = [];

  paymentTypesFiltered:IPayment[] = [];

  paymentTypesIds:number[]=[];

  enablePaymentType:boolean = false;


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
    work_hours  : '',
    paymentTypes : []
  }



  private subscriptionRoute?:Subscription;
  private subscription? : Subscription;
  private updateAccountOptionSubscription? : Subscription;
  private logoSubscription? : Subscription;
  private imageSubscription? : Subscription;
  private paymentTypesSubscription? : Subscription;

  constructor (
    private apiService:APIService,
    private authService:AuthenticationService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
  ) { }


  ngOnDestroy(): void {
    if(this.subscriptionRoute!) this.subscriptionRoute!.unsubscribe();
    if(this.subscription!) this.subscription!.unsubscribe();
    if(this.logoSubscription!) this.logoSubscription!.unsubscribe();
    if(this.imageSubscription!) this.imageSubscription!.unsubscribe();
    if(this.paymentTypesSubscription) this.paymentTypesSubscription!.unsubscribe();
    if(this.updateAccountOptionSubscription!) this.updateAccountOptionSubscription!.unsubscribe();
  }


  ngOnInit() {

     this.subscriptionRoute = this.route.paramMap.subscribe((params)=>{
      this.id = params.get('accountId') || '' ;
      this.accountOption.id = +this.id;
    });
    
   this.subscription = this.authService.getAccount(this.id).pipe(finalize(() => {
    
    })).subscribe(
      (res:IAccountResponse)=> {
        this.currentAccount = res;
        this.accountOption.min_value = this.currentAccount!.min_value;
        this.accountOption.min_quan = this.currentAccount!.min_quan;
        this.accountOption.currency = res.currency!;
        this.accountOption.delivery_period = this.currentAccount!.delivery_period;
        this.accountOption.weekend = this.currentAccount!.weekend;
        this.accountOption.work_hours = this.currentAccount!.work_hours;
        
        this.accountOption.paymentTypes = 
            this.currentAccount.paymentTypes ? 
            this.currentAccount.paymentTypes.sort((a,b)=> a.paymentId - b.paymentId) :
            [];



        this.paymentTypesIds =  res.paymentTypes ? res.paymentTypes!.map((pay)=>{return pay.paymentId}) : [];
        this.logoUrl = `${this.apiService.apiHost}${this.currentAccount?.account_logo}` 
        this.imageUrl = `${this.apiService.apiHost}${this.currentAccount?.account_image}` ;
       
        this.getPaymentMethods();
      }

    );

  }

  

private  getPaymentMethods():void{
     this.paymentTypesSubscription = 
                 this.authService.getPaymentTypes()
               //  .pipe(map((types)=> {return types.filter((payment)=> !this.paymentTypesIds.includes(payment.id))} ))
                 .subscribe((filteredTypes)=>{
                  this.paymentTypes = filteredTypes;
                  this.paymentTypesFiltered = this.paymentTypes ;
                 });

  }



  getNewPaymentMethod():IAccountPayment {
    const paymentMethod : IAccountPayment = {
      accountId: +this.id,
      paymentId: 0,
      wallet_number: '',
      wallet_password: '',
      card_holder_name: '',
      account_number: '',
      expiry_month: '',
      expiry_year: '',
      cvc: ''
    };
    return paymentMethod;
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

  viewDetail(payment:IAccountPayment){
    if( ![3,4].includes(payment.paymentId) )
       return;

      this.enablePaymentType = true;
      this.paymentTypesFiltered = this.paymentTypes ;
      this.currentAccountPayment!     
                            = payment ;
  }

  updatePaymentMethod(accountPayment:IAccountPayment){
    let currentMethod = this.accountOption
                              .paymentTypes!
                              .find((e)=> e.paymentId === accountPayment.paymentId);
      if(currentMethod)
           currentMethod = accountPayment;
      else{
        this.accountOption
            .paymentTypes!
            .push(accountPayment);
    
        this.paymentTypesIds =
          this.accountOption.paymentTypes ?
          this.accountOption.paymentTypes!.map((pay)=>{return pay.paymentId}) :
            [];  
      }     

     this.currentAccountPayment = undefined;
  }

  addPayment(){

    const remainderTypes =  this.paymentTypes.filter((payment)=> !this.paymentTypesIds.includes(payment.id));

        if(remainderTypes.length > 0){
          this.enablePaymentType = false;
          this.paymentTypesFiltered = remainderTypes ;
          this.currentAccountPayment! 
              = this.getNewPaymentMethod();

        }
        else{
          this.presentAlert();
        }
          
  }

  cancelUpdate(){
    this.currentAccountPayment = undefined;
  }

  getPaymentName(id:number){
    const payment = this.paymentTypes.find((e)=> e.id === id);
    return payment ? payment.paymentType : '' ;
  }


  // alert no payment method remaind

  async presentAlert( ) {
    const alert = await this.alertController.create({
      header: 'تنبيه',
      subHeader: '',
      message: `تم إضافة جميع طرق الدفع`,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
