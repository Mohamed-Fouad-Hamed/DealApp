import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule , AnimationController , LoadingController , ModalController} from '@ionic/angular';
import { InfiniteScrollCustomEvent , OverlayEventDetail } from '@ionic/core/components';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, map, Subscription } from 'rxjs';
import { Item } from 'src/app/types/types';
import { SingleSelectionSearchComponent } from 'src/app/modals/single-selection-search/single-selection-search.component';
import { APIService } from 'src/app/services/API/api.service';
import { UomGroupService } from 'src/app/services/model-services/uom-group-service/uomgroupservice';
import { IUnit, IUomConverterRequest, IUomGroupRequest } from 'src/app/interfaces/DB_Models';
import { SearchableSelectComponent } from 'src/app/components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-uom-group',
  templateUrl: './uom-group.page.html',
  styleUrls: ['./uom-group.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule ,TranslateModule,RouterLink,SingleSelectionSearchComponent,SearchableSelectComponent]
})
export class UomGroupPage implements OnInit {

  @ViewChild('modal') modal!: ModalController;

  @ViewChild('UomGroupFrm') public UomGroupFrm!: NgForm;

  private api = inject(APIService);

  private uomGroupService = inject(UomGroupService);
 
  isLoading : boolean = false ;

  apiServer?:string;
 
  err:string ='';

   
     private subscription? : Subscription;
     private subscriptionSearch? :Subscription;
     private subscriptionUomGroup? : Subscription;
     private subscriptionUnits? : Subscription;
   
     uomGroupRequest! : IUomGroupRequest ;
      
      private get newUomGroup():IUomGroupRequest {
          const nUomGroup : IUomGroupRequest = {
            id: 0,
            name: '',
            descr: '',
            uomConverterReqList: []
          };
          return nUomGroup;
      }
  
     addUomGroup(){
       this.uomGroupRequest  = this.newUomGroup;
     } 

     addUC(){
        const uC : IUomConverterRequest = {
            id: 0,
            uom_group: 0,
            alt_uom:  0,
            alt_qty: 0,
            base_uom: 0,
            base_qty: 0
          }
          this.uomGroupRequest.uomConverterReqList.push( uC);
     }


     isToastOpen = false;
   
    uomGroupsCurrentPage : number = 0;
    uomGroupsPageSize : number = 11;
    uomGroupsCount : number = 0;

    uomGroupsLoading : boolean = false;

    searchTextValue : string = '';

    items:Item[] = [] ;

    units:IUnit[] = [];

    altUnits:IUnit[] = [];

    baseUnits:IUnit[] = [];

    customProductSelectOptions = {
      header: '' ,
      translucent: true,
    };
  
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
       if(this.subscriptionUomGroup) this.subscriptionUomGroup!.unsubscribe();
       if(this.subscriptionUnits) this.subscriptionUnits!.unsubscribe();
     }
   
     ngOnInit() {   
      this.apiServer! = this.api.apiHost;
      this.addUomGroup();
      this.getUnits();
     }
   

    async getUnits(){
        this.showLoading();
        this.subscriptionUnits = this.uomGroupService.getUnits().pipe(finalize(()=>{
                  setTimeout(()=> this.hideLoading(),1000);
                }),
                map((units:any) => { 
                  const _items:IUnit[] = units.list.map((unit:any)=>{
                  
                  const _unit:IUnit = {
                    id:unit.id ,
                    name:unit.name
                  } ; 
                return _unit;
            }); 
                return _items;
          }
        )).subscribe(
          { 
            next:(units) => { 
              this.units = [...units];
             },
            error:  err =>{
              setTimeout(()=> this.hideLoading(),1000);
            }
          }  
        );
     }

     async  onSubmit() {
       if (this.UomGroupFrm.invalid) {
         return;
       }
   
       this.isLoading = true;
       
       try{
      
       this.subscription =  this.uomGroupService.updateUomGroup(
           this.uomGroupRequest
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
       this.UomGroupFrm.reset();
     }
  
    searchValueEmit($value:any){
     
         this.uomGroupsCurrentPage = 0 ;
     
         this.uomGroupsLoading = true ;
     
         this.items = [] ;
     
         if($value === '') return;
     
         this.searchTextValue = $value;
     
         this.showLoading();
     
         this.subscriptionSearch = this.uomGroupService.getPageableUomGroupsByNameLikePageable($value ,this.uomGroupsCurrentPage,this.uomGroupsPageSize).pipe(finalize(()=>{
                   this.uomGroupsLoading = false ;
                   setTimeout(()=> this.hideLoading(),1000);
                 }),
                 map((uomGroups:any) => { 
                   this.uomGroupsCount = uomGroups.count;
                   const _items:Item[] = uomGroups.list.map((group:any)=>{
                   
                   const _unit:Item = {
                     id:group.id ,
                     name:group.name,
                     text: group.name ,
                     value: group.id ,
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
               this.uomGroupsLoading = false ;
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
  
          this.subscriptionUomGroup = this.uomGroupService.getUomGroup(data.value).pipe(finalize(()=>{
                setTimeout(()=> this.hideLoading(),1000);
              })
            ,map((msg)=>{
              const unit = msg.entity;
              const ug :IUomGroupRequest = {
                id: unit.id,
                name: unit.name,
                descr: unit.descr,
                uomConverterReqList: unit.uomConverterDtoList.map((u:any)=>{
                  const uc :IUomConverterRequest = {
                    id: u.id,
                    uom_group: unit.id,
                    alt_uom: u.alt_uom,
                    alt_qty: u.alt_qty,
                    base_uom: u.base_uom,
                    base_qty: u.base_qty
                  }
                  return uc;
                })
              }
              return ug ;
            })).subscribe(
        { 
          next:(unit) => { 
            this.uomGroupRequest = unit; 
          },
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
    
        this.uomGroupsCurrentPage++;
    
        this.uomGroupsLoading = true ;
    
        this.subscriptionSearch = this.uomGroupService.getPageableUomGroupsByNameLikePageable(this.searchTextValue ,this.uomGroupsCurrentPage,this.uomGroupsPageSize).pipe(finalize(()=>{
                  this.uomGroupsLoading = false ;
                  setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
                  setTimeout(()=> this.hideLoading(),1000);
                }),
                map((groups:any) => { 
                  this.uomGroupsCount = groups.count;
                  const _items:Item[] = groups.list.map((group:any)=>{
                  
                  const _unit:Item = {
                    id:group.id ,
                    name:group.name,
                    text: group.name ,
                    value: group.id,
                    icon : 'assets/images/no-image.jpg'
                  } ; 
                return _unit;
            }); 
                return _items;
          }
          )).subscribe(
          { 
            next:(groups) => { this.items.push( ... groups); },
            error:  err =>{
              console.log(err);
              this.uomGroupsLoading = false ;
              setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
              setTimeout(()=> this.hideLoading(),1000);
            }
          }  
          );
  
    }
  
    infiniteScrollEmit(ev:any){
      
          if( this.uomGroupsLoading ) return;
      
          if(this.searchTextValue === '')
          {
            (ev as InfiniteScrollCustomEvent).target.complete();
          }
            
          const noMoreDataToFetch = (this.items!.length == this.uomGroupsCount);
      
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
