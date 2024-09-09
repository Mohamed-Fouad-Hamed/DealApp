import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit,  Output, ViewChild ,AfterViewInit, input,computed, effect } from '@angular/core';
import { IonicModule ,IonDatetime} from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IAccountOfferReq, IAccountOfferRes } from 'src/app/interfaces/DB_Models';
import { OfferService } from 'src/app/services/model-services/account-offer/offer.service';
import { finalize, Subscription } from 'rxjs';
import { format } from 'date-fns/format';
import { hasChanges } from 'src/app/utilities/ObjectsOps';

@Component({
  selector: 'offer-header',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  standalone:true,
  imports:[IonicModule, CommonModule, FormsModule,TranslateModule]
})
export class OfferComponent  implements OnInit , OnDestroy ,AfterViewInit {

  @Input() public Account:string = '';

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

  startAtValue:string = format( new Date() ,'yyyy-MM-dd') + 'T' + format( new Date() ,'HH:mm');

  @ViewChild(IonDatetime) endAt?: IonDatetime ;

  endAtString:string =  format( new Date() ,'yyyy/MM/dd hh:mm a');

  endAtValue:string = format( new Date() ,'yyyy-MM-dd')+'T'+format( new Date() ,'HH:mm');

  private subscription? : Subscription;

  accountOfferReq : IAccountOfferReq = {

    id : 0 ,

    accountId : 0 ,

    off_name : '',

    o_date : new Date().toISOString() ,

    startAt : new Date().toISOString(),

    endAt : new Date().toISOString(),

    is_active : false
    
  }

   nativeOffer?:IAccountOfferReq;

  
  constructor() { 

    effect(()=>{
      this.accountOfferReq = this.AccountOffer();
      this.nativeOffer! = {...this.accountOfferReq};
      this.o_dateValue = format( this.accountOfferReq.o_date ,'yyyy-MM-dd')+'T'+format( this.accountOfferReq.o_date ,'HH:mm'); 
      this.o_dateString = format( this.accountOfferReq.o_date ,'yyyy/MM/dd hh:mm a') ;
      this.startAtValue = format( this.accountOfferReq.startAt ,'yyyy-MM-dd')+'T'+format( this.accountOfferReq.startAt ,'HH:mm'); 
      this.startAtString = format( this.accountOfferReq.startAt ,'yyyy/MM/dd hh:mm a') ;
      this.endAtValue = format( this.accountOfferReq.endAt ,'yyyy-MM-dd')+'T'+format( this.accountOfferReq.endAt ,'HH:mm'); 
      this.endAtString = format( this.accountOfferReq.endAt ,'yyyy/MM/dd hh:mm a') ;
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

  
  startAtChanged(value:any){
    this.startAtValue! = value;
    this.startAtString = format(value,'yyyy/MM/dd hh:mm a');
  }

  startAtConfirm(){
     this.startAt!.confirm(true);
  }

  startAtCancel(){
      this.startAt!.cancel(true);
  }


  endAtChanged(value:any){
    this.endAtValue! = value;
    this.endAtString = format(value,'yyyy/MM/dd hh:mm a');
  }

  endAtConfirm(){
     this.endAt!.confirm(true);
  }

  endAtCancel(){
      this.endAt!.cancel(true);
  }

  async  onSubmit() {

   

    if (this.accountOfferFrm.invalid ) {
      return;
    }
  
    this.isLoading = true;

    try{
   
      this.accountOfferReq.accountId = +this.Account;
      this.accountOfferReq.o_date = this.o_dateValue;
      this.accountOfferReq.startAt = this.startAtValue;
      this.accountOfferReq.endAt = this.endAtValue;

      if(!hasChanges(this.accountOfferReq,this.nativeOffer!)){
        this.updateEventEmitter.emit(undefined);
        return;
      }
      
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
}

}
