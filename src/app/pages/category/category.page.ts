import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoryService } from 'src/app/services/model-services/category-service/category.service';
import { Router } from '@angular/router';
import { ICategoryRequest, ICategoryResponse } from 'src/app/interfaces/DB_Models';
import { TranslateModule } from '@ngx-translate/core';
import {  RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { AsyncCategoryNameIsUniqueDirective } from '../../validations/directives/AsyncCategoryNameIsUnique';
import { Subscription, finalize } from 'rxjs';


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

  private router = inject(Router);

  private err?:string;

  isLoading : boolean = false ;

  private subscription? : Subscription;
 

  categoryRequest:ICategoryRequest = {
          id:0,
          name:'',
          descr:'',
          account_type:''
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
   this.subscription!.unsubscribe();
  }

  ngOnInit() {
    
  }

  async  onSubmit() {
    if (this.categoryFrm.invalid) {
      return;
    }

    this.isLoading = true;
    
    try{
   
    this.subscription =  this.categoryService.uploadCategory(
        this.categoryFrm.value
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

  

}