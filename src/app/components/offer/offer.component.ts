import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit,  Output, ViewChild ,AfterViewInit, input,computed, effect } from '@angular/core';
import { IonicModule ,IonDatetime} from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IAccountOfferReq, IAccountOfferRes } from 'src/app/interfaces/DB_Models';
import { OfferService } from 'src/app/services/model-services/account-offer/offer.service';
import { finalize, Subscription } from 'rxjs';
import { format } from 'date-fns/format';

@Component({
  selector: 'offer-header',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class OfferComponent  implements OnInit , OnDestroy ,AfterViewInit {

  @Input() public Account:string = '';

  //@Input() public AccountOffer:IAccountOfferReq | undefined;

  AccountOffer = input.required<IAccountOfferReq>();

  @Output() updateEventEmitter = new EventEmitter<IAccountOfferRes>();

  @Output() cancelEventEmitter = new EventEmitter<void>();

  private offerService = inject(OfferService);

  @ViewChild('accountOfferForm') public accountOfferFrm!: NgForm;

  isLoading : boolean = false ;

  error : string = '';

  @ViewChild(IonDatetime) o_date?: IonDatetime ;

  o_dateString:string = format( new Date() ,'yyyy/MM/dd hh:mm a') ;

  o_dateValue:string = format( new Date() ,'yyyy-MM-dd')+'T'+format( new Date() ,'HH:mm');

  @ViewChild(IonDatetime) startAt?: IonDatetime ;

  startAtString:string =  format( new Date() ,'yyyy/MM/dd hh:mm a');

  @ViewChild(IonDatetime) endAt?: IonDatetime ;

  endAtString:string =  format( new Date() ,'yyyy/MM/dd hh:mm a');

  private subscription? : Subscription;

  accountOfferReq : IAccountOfferReq = {

    id : 0 ,

    accountId : 0 ,

    off_name : '',

    o_date : new Date() ,

    startAt : new Date(),

    endAt : new Date(),

    is_active : false,
    
    offerDetailsList : []
    
  }

  
  constructor() { 

    effect(()=>{
      this.accountOfferReq = this.AccountOffer();
      console.log('effect offer req ', this.AccountOffer())
    })

  }


  ngAfterViewInit(): void {
   
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit() {
   
  }

  oDateChanged(value:any){
    this.o_dateValue = value;
    this.o_dateString = format(value,'yyyy/MM/dd hh:mm a');

  }

  oDateConfirm(){
     this.o_date!.confirm(true);
  }

  oDateCancel(){
      this.o_date!.cancel(true);
  }

  async  onSubmit() {

    if (this.accountOfferFrm.invalid) {
      return;
    }
  
    this.isLoading = true;

    try{
   
      this.accountOfferReq.accountId = +this.Account;
      
      this.subscription = this.offerService.uploadOffer(
            this.accountOfferReq
        ).pipe( finalize(() => {
                setInterval(
                  ()=>{
                    this.isLoading=false;
                  }
                  ,500
                );
        }) )
        .subscribe({ next: (res) => {
         
          if(res.status === 200){
            
               this.updateEventEmitter.emit(res.entity);
           }
          
         }
         ,error:(err)=>{ this.error = err.message }} 
        );

    }catch( e:any){
      this.error = e.message;
  
    }
  }

cancel(){
    this.cancelEventEmitter.emit();
    console.log(this.AccountOffer())
}

}
