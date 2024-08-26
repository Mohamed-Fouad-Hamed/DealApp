import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule , PopoverController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/model-services/category-service/category.service';
import { Router } from '@angular/router';
import { ICategoryRequest, ICategoryResponse } from 'src/app/interfaces/DB_Models';
import { TranslateModule } from '@ngx-translate/core';
import {  RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { AsyncCategoryNameIsUniqueDirective } from '../../validations/directives/AsyncCategoryNameIsUnique';
import { PopoverSelectComponent } from 'src/app/modals/popover-select/popover-select.component';
import { Subscription, finalize, map } from 'rxjs';
import { SingleItem } from 'src/app/types/types';
import { GroupService } from 'src/app/services/model-services/group-service/group.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule,RouterLink,IonRouterLink,AsyncCategoryNameIsUniqueDirective]
})
export class CategoryPage implements OnInit , OnDestroy{

  @ViewChild('categoryFrm') public categoryFrm!: NgForm;
 
  private categoryService = inject(CategoryService);

  private groupService = inject(GroupService);

  private popoverController = inject( PopoverController); 

  private router = inject(Router);

  groupName?:SingleItem = {id:'',name:'Select Group',icon:''};

  private mItems : SingleItem[] = [] ;

  err:string ='';

  isLoading : boolean = false ;

  private subscription? : Subscription;
  private groupSubscription? : Subscription;
 

  categoryRequest:ICategoryRequest = {
          id:0,
          name:'',
          descr:'',
          account_type:'',
          group_id : 0
        };

  categoryResponse:ICategoryResponse = {
          id:0,
          name:'',
          descr:'',
          img:'',
          accountType:''
        };  
        
  isToastOpen = false;

  setOpenToast(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  constructor(   ) { }

  ngOnDestroy(): void {
    if( this.subscription) this.subscription!.unsubscribe();
  }

  ngOnInit() {

    this.groupSubscription = this.groupService.getGroups()
                                 .pipe(map((groups:any) => {
                                          const _groups : SingleItem [] = 
                                          groups.map((group:any) => { const _group : SingleItem =  { id:group.id,name:group.name,icon:group.img } ; 
                                          return _group; 
                                          });
                                          
                                          return _groups;
                                       }))
                                    .subscribe((groups)=>{  
                                                this.mItems = groups ; 
                                      })
    
  }

  async  onSubmit() {
    if (this.categoryFrm.invalid) {
      return;
    }

    this.isLoading = true;
    
    try{
   
    this.subscription =  this.categoryService.uploadCategory(
        this.categoryRequest
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
               this.setOpenToast(true)
               setTimeout(()=> {this.router.navigate([`/category-profile/${id}`])},2000)
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
    this.categoryFrm.reset();
  }

  
  async openPopOver(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverSelectComponent,
      event: ev,
      translucent: false,
      componentProps: {
        title: "Groups",
        items: this.mItems,
      }
    });
     
     await popover.present();
     
     // Listen for onDidDismiss
     const { data } = await popover.onDidDismiss();
     
     if (data) {
       this.groupName! = data?.selectedItem ;
       this.categoryRequest.group_id = +this.groupName!.id;
     }
     else{
      this.groupName! = {id:'',name:'Select Group',icon:''};
      this.categoryRequest.group_id = 0 ;
     }
   }

}