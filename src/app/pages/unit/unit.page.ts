import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule , AnimationController , LoadingController , ModalController} from '@ionic/angular';
import { InfiniteScrollCustomEvent , OverlayEventDetail } from '@ionic/core/components';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UnitService } from 'src/app/services/model-services/unit-service/unit.service';
import { finalize, map, Subscription } from 'rxjs';
import { IUnitRequest } from 'src/app/interfaces/DB_Models';
import { Item } from 'src/app/types/types';
import { SingleSelectionSearchComponent } from 'src/app/modals/single-selection-search/single-selection-search.component';
import { APIService } from 'src/app/services/API/api.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.page.html',
  styleUrls: ['./unit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , SingleSelectionSearchComponent,TranslateModule,RouterLink]
})
export class UnitPage implements OnInit {

  @ViewChild('modal') modal!: ModalController;

  @ViewChild('unitFrm') public unitFrm!: NgForm;

   private api = inject(APIService);
 
   private unitService = inject(UnitService);

   apiServer?:string;
 
   err:string ='';
 
   isLoading : boolean = false ;
 
   private subscription? : Subscription;
   private subscriptionSearch? :Subscription;
   private subscriptionUnit? : Subscription;
 
   unitRequest : IUnitRequest = {
          id: 0,
          name: '',
          uom_length: '',
          uom_height: '',
          uom_width: '',
          uom_volume: '',
          uom_weight: ''
   };
    
   isToastOpen = false;
 
  unitsCurrentPage : number = 0;
  unitsPageSize : number = 11;
  unitsCount : number = 0;
  unitsLoading : boolean = false;
  searchTextValue : string = '';
  items:Item[] = [] ;

  selecteditemText:string = 'select item';

   setOpenToast(isOpen: boolean) {
     this.isToastOpen = isOpen;
   }
 
   constructor(private animationCtrl: AnimationController ,private loadingCtrl : LoadingController ) { }

   async showLoading() {
     const loading = await this.loadingCtrl.create({
       spinner: "lines-sharp",     
       mode: "ios"
     });
 
     loading.present();
   }
 
   async hideLoading(){
     await this.loadingCtrl.dismiss();
    }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

 
   ngOnDestroy(): void {
     if(this.subscription) this.subscription!.unsubscribe();
     if(this.subscriptionSearch) this.subscriptionSearch!.unsubscribe();
     if(this.subscriptionUnit) this.subscriptionUnit!.unsubscribe();
   }
 
   ngOnInit() {   
    this.apiServer! = this.api.apiHost;
   }
 
   async  onSubmit() {
     if (this.unitFrm.invalid) {
       return;
     }
 
     this.isLoading = true;
     
     try{
    
     this.subscription =  this.unitService.updateUnit(
         this.unitRequest
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
                const{id} = res.entity;
                this.setOpenToast(true);
             }
 
           },
           error: (err) => { console.log(err); this.err = err.message; }
         }
         );
 
     }catch( e:any){
       this.err = e.message;
     
     }
 
    
   }
 
   onReset(): void {
     this.unitFrm.reset();
   }

     searchValueEmit($value:any){
   
       this.unitsCurrentPage = 0 ;
   
       this.unitsLoading = true ;
   
       this.items = [] ;
   
       if($value === '') return;
   
       this.searchTextValue = $value;
   
       this.showLoading();
   
       this.subscriptionSearch = this.unitService.getPageableUnitsByNameLikePageable($value ,this.unitsCurrentPage,this.unitsPageSize).pipe(finalize(()=>{
                 this.unitsLoading = false ;
                 setTimeout(()=> this.hideLoading(),1000);
               }),
               map((units:any) => { 
                 this.unitsCount = units.count;
                 const _items:Item[] = units.list.map((unit:any)=>{
                 
                 const _unit:Item = {
                   id:unit.id ,
                   name:unit.name,
                   text: unit.name ,
                   value: unit.id ,
                   icon : 'assets/images/no-image.jpg'
                 } ; 
               return _unit;
           }); 
               return _items;
          }
       )).subscribe(
         { 
           next:(units) => { this.items = units },
           error:  err =>{
             console.log(err);
             this.unitsLoading = false ;
             setTimeout(()=> this.hideLoading(),1000);
            }
         }  
       );
       
     }
   
  onWillDismiss(event: Event) {

      const ev = event as CustomEvent<OverlayEventDetail<any>>;
      const {role , data } = ev.detail;
      if (role === 'confirm' && data) {
       
        this.showLoading();

        this.subscriptionUnit = this.unitService.getUnit(data.value).pipe(finalize(()=>{
              setTimeout(()=> this.hideLoading(),1000);
            })).subscribe(
      { 
        next:(unit) => { this.unitRequest = unit.entity; },
        error:  err =>{
          setTimeout(()=> this.hideLoading(),1000);
        }
      }  
      );
      
      }
  
      this.items = [];
  
    }
  

   itemSelected($item:any){
    this.modal.dismiss($item,'confirm');
  }

  loadMoreProducts(ev:any){
  
      this.unitsCurrentPage++;
  
      this.unitsLoading = true ;
  
      this.subscriptionSearch = this.unitService.getPageableUnitsByNameLikePageable(this.searchTextValue ,this.unitsCurrentPage,this.unitsPageSize).pipe(finalize(()=>{
                this.unitsLoading = false ;
                setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
                setTimeout(()=> this.hideLoading(),1000);
              }),
              map((units:any) => { 
                this.unitsCount = units.count;
                const _items:Item[] = units.list.map((unit:any)=>{
                
                const _unit:Item = {
                  id:unit.id ,
                  name:unit.name,
                  text: unit.name ,
                  value: unit.id,
                  icon : 'assets/images/no-image.jpg'
                } ; 
              return _unit;
          }); 
              return _items;
        }
        )).subscribe(
        { 
          next:(units) => { this.items.push( ... units); },
          error:  err =>{
            console.log(err);
            this.unitsLoading = false ;
            setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
            setTimeout(()=> this.hideLoading(),1000);
          }
        }  
        );

    }

     infiniteScrollEmit(ev:any){
    
        if( this.unitsLoading ) return;
    
        if(this.searchTextValue === '')
        {
          (ev as InfiniteScrollCustomEvent).target.complete();
        }
          
        const noMoreDataToFetch = (this.items!.length == this.unitsCount);
    
        if(noMoreDataToFetch){
         // (ev as InfiniteScrollCustomEvent).target.complete();
           (ev as InfiniteScrollCustomEvent).target.disabled = true ;
        }
        else{
          setTimeout(() => {
            this.loadMoreProducts(ev);
          }, 1000);
        }
          
      }
 
}
