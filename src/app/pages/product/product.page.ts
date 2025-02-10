import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule  ,PopoverController} from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IProductRequest, IProductResponse } from 'src/app/interfaces/DB_Models';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';
import { Subscription, finalize, map } from 'rxjs';
import {  Router, RouterLink } from '@angular/router';
import { IonRouterLink } from '@ionic/angular/standalone';
import { SingleItem } from 'src/app/types/types';
import { PopoverSelectComponent } from 'src/app/modals/popover-select/popover-select.component';
import { CategoryService } from 'src/app/services/model-services/category-service/category.service';
import { IAccountResponse, IUserResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule,RouterLink,IonRouterLink ]
})
export class ProductPage implements OnInit , OnDestroy {

  private router = inject(Router);

  private popoverController = inject( PopoverController); 

  private authService = inject(AuthenticationService);

  @ViewChild('productForm') public productFrm!: NgForm;
 
  isLoading : boolean = false ;

  imageUrl:string = '';

  error:string = '';

  private subscription? : Subscription;

  private categorySubscription? : Subscription;

  private factoryAccountsSubscription? : Subscription;

  categoryName?:SingleItem = {id:'',name:'Select Gategory',icon:''};

  private mItems : SingleItem[] = [] ;

  accountName?:SingleItem = {id:'',name:'Select Gategory',icon:''};

  private aItems : SingleItem[] = [] ;

  private observableUser? : IUserResponse;

  product:IProductRequest = {
          id:0,
          name:'',
          descr:'',
          has_first:false,
          first_unit:'',
          first_price:0,
          unit_count:0,
          has_second:false,
          second_unit:'',
          second_price:0,
          category_id:0,
          factory_id:0
        };
 
  productResponse:IProductResponse = {
          id:0,
          name:'',
          descr:'',
          has_first:false,
          first_unit:'',
          first_price:0,
          unit_count:0,
          has_second:false,
          second_unit:'',
          second_price:0,
          product_image:''
        };
       
        isToastOpen = false;

        setOpenToast(isOpen: boolean) {
          this.isToastOpen = isOpen;
        }

  constructor(
    private categoryService:CategoryService,
    private productService:ProductService,
  ) { }


  ngOnDestroy(): void {
    if(this.subscription) this.subscription!.unsubscribe();
    if(this.categorySubscription) this.categorySubscription!.unsubscribe();
    if(this.factoryAccountsSubscription) this.factoryAccountsSubscription!.unsubscribe();
  }

  ngOnInit() {
    this.initiUser();
    this.initiCategories();
  }


  initiUser(){

    this.authService.getUserAuth().subscribe((oUser)=>{
      this.observableUser = oUser;
      this.initiAccounts(this.observableUser!.account_type);
    });
     
  }

  initiAccounts(account_type:string){

    this.factoryAccountsSubscription = this.productService.getFactoryAccountsByAccountType(account_type)
                                      .pipe(map((accounts:any) => {
                                            const _accounts : SingleItem [] = 
                                            accounts.map((account:IAccountResponse) => { const _account : SingleItem =  { id:''+account.id,name:account.account_name,icon:account.account_logo } ; 
                                            return _account; 
                                            });
                                            
                                            return _accounts;
                                         }))
                                      .subscribe((accounts)=>{  
                                                  this.mItems = accounts ; 
                                        })

  }


  initiCategories(){
    this.categorySubscription = this.categoryService.getCategories()
    .pipe(map((categories:any) => {
          const _categories : SingleItem [] = 
          categories.map((category:any) => { const _category : SingleItem =  { id:category.id,name:category.name,icon:category.img } ; 
          return _category; 
          });
          
          return _categories;
       }))
    .subscribe((categories)=>{  
                this.mItems = categories ; 
      });
  }

  async  onSubmit() {

    if (this.productFrm.invalid) {
      return;
    }
  
    this.isLoading = true;
    try{
   
      this.subscription = this.productService.uploadProduct(
            this.product
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
                const{id} = res.entity;
                this.setOpenToast(true)
                setTimeout(()=> {this.router.navigate([`/product-profile/${id}`])},2000)
           }
          
         }
         ,error:(err)=>{ this.error = err.message }} 
        );

    }catch( e:any){
      this.error = e.message;
    
    }


  }

  


  async openPopOver(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverSelectComponent,
      event: ev,
      translucent: false,
      componentProps: {
        title: "Categories",
        items: this.mItems,
      }
    });
     
     await popover.present();
     
     // Listen for onDidDismiss
     const { data } = await popover.onDidDismiss();
     
     if (data) {
       this.categoryName! = data?.selectedItem ;
       this.product.category_id = +this.categoryName!.id;
     }
     else{
      this.categoryName! = {id:'',name:'Select Gategory',icon:''};
      this.product.category_id = 0 ;
     }
   }


   async openPopOverAccounts(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverSelectComponent,
      event: ev,
      translucent: false,
      componentProps: {
        title: "Accounts",
        items: this.aItems,
      }
    });
     
     await popover.present();
     
     // Listen for onDidDismiss
     const { data } = await popover.onDidDismiss();
     
     if (data) {
       this.accountName! = data?.selectedItem ;
       this.product.factory_id = +this.accountName!.id;
     }
     else{
      this.accountName! = {id:'',name:'Select Gategory',icon:''};
      this.product.factory_id = 0 ;
     }
   }

  
}
