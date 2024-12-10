import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule ,  LoadingController , InfiniteScrollCustomEvent } from '@ionic/angular';
import { finalize, map, Subscription  } from 'rxjs';
import { CategoryService } from 'src/app/services/model-services/category-service/category.service';
import { ICategoryResponse, IProductResponse } from 'src/app/interfaces/DB_Models';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';
import { ActivatedRoute } from '@angular/router';
import { MessagePageableResponse, MessageResponse } from 'src/app/services/interfaces/MessageResponse';
import { APIService } from 'src/app/services/API/api.service';
import { TranslateModule } from '@ngx-translate/core';

//scrolling
import { ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule , ScrollingModule  ]
})
export class GroupDetailsPage implements OnInit ,OnDestroy{

  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private apiService = inject(APIService);

  public categories :  ICategoryResponse[] = [] ;
  public products : IProductResponse[] = [];

  productsCurrentPage : number = 0;
  productsPageSize : number = 10;
  productsCount : number = 0;

  categoriesSubscription?:Subscription;

  productsSubscription?:Subscription;
 
  private groupId : string = '';

  private categoryId : string = '';

  private route = inject(ActivatedRoute);

  categoriesLoading : boolean = true;

  productsLoading  : boolean = true ;

  selectAllCategories : boolean = true ;

  constructor( private loadingCtrl: LoadingController ) { }

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

  ngOnDestroy(): void {
    if(this.categoriesSubscription)
      this.categoriesSubscription.unsubscribe();
    if(this.categoriesSubscription)
      this.categoriesSubscription.unsubscribe();
  }

 async  ngOnInit() {

       this.showLoading();

      this.route.paramMap.subscribe((params)=>{
        this.groupId = params.get('groupId') || '';
      });
       
       await this.selectAllButtonClicked();

       await this.initiCategoriesByGroup();
  }

  private async initiCategoriesByGroup(){

   this.categoriesSubscription! = this.categoryService.getCategoriesByGroup(this.groupId)
                        .pipe(finalize(()=>{ this.categoriesLoading = false ;  }))
                        .subscribe({next:(categoriesArr)=>{
                          this.categories = categoriesArr ;
                        },error: err =>{ this.categoriesLoading = false ; }});
  }

  private async initiProducts() {

    this.productsLoading = true ;

    this.productsSubscription! = this.productService.getCountAndPageableProductsByGroupId(
                                                    this.groupId,this.productsCurrentPage,this.productsPageSize
                                                    ).pipe(finalize(()=>{
                                                      this.productsLoading = false ;
                                                      setTimeout(()=> this.hideLoading(),1000);
                                                    }), map((message:MessagePageableResponse)=>{
                                                      this.productsCount = message.count;
                                                      const products = message.list.map((product:IProductResponse)=>{
                                                         product.product_image = product.product_image !== undefined && product.product_image !== '' ? `${this.apiService.apiHost}${product.product_image}` : '../../assets/images/no-image.jpg';
                                                         return product;
                                                      });
                                                      
                                                      return products;
                                                    })).subscribe({next:(productsArr)=>{
                                                       this.products = productsArr;
                                                    } ,error: err =>{
                                                      console.log(err);
                                                      this.productsLoading = false ;
                                                      setTimeout(()=> this.hideLoading(),1000);
                                                  }});
     
  }

  selectAllButtonClicked(){

    this.productsCurrentPage = 0 ;

    this.productsLoading = true ;

    this.selectAllCategories = true ;

    this.initiProducts();

  }



  segmentButtonClicked(category:ICategoryResponse){

    this.showLoading();

    this.productsCurrentPage = 0 ;

    this.productsLoading = true ;

    this.selectAllCategories = false ;

    this.categoryId = '' + category.id;

    this.productsSubscription! = this.productService.getCountAndPageableProductsByCategoryId(
      this.categoryId,this.productsCurrentPage,this.productsPageSize
      ).pipe(finalize(()=>{
        this.productsLoading = false ;
        setTimeout(()=> this.hideLoading(),1000);
      }),map((message:MessagePageableResponse)=>{
        this.productsCount = message.count;
        const products = message.list.map((product:IProductResponse)=>{
           product.product_image = product.product_image !== undefined && product.product_image !== '' ? `${this.apiService.apiHost}${product.product_image}` : '../../assets/images/no-image.jpg';
           return product;
        });

        return products;
      })).subscribe( { next :(productsArr)=>{
         this.products = productsArr;
      } , error: err =>{
            console.log(err);
            this.productsLoading = false ;
            setTimeout(()=> this.hideLoading(),1000);
        } });
  }

  loadMoreProducts(ev:any){

    this.productsCurrentPage++;

    this.productsLoading = true ;

    if(this.selectAllCategories){

      this.productsSubscription! = this.productService.getPageableProductsByGroupId(
       
        this.groupId,this.productsCurrentPage,this.productsPageSize

        ).pipe(finalize(()=>{
          this.productsLoading = false ;
          (ev as InfiniteScrollCustomEvent).target.complete();
        }),map((message:MessageResponse)=>{
          const products = message.list.map((product:IProductResponse)=>{
             product.product_image = product.product_image !== undefined && product.product_image !== '' ? `${this.apiService.apiHost}${product.product_image}` : '../../assets/images/no-image.jpg';
             return product;
          });
          return products;
        })).subscribe({next:(productsArr)=>{
           this.products.push( ... productsArr);
        } ,error : err =>{
          console.log(err);
          this.productsLoading = false ;
          setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
      }});


    }else{

      this.productsSubscription! = this.productService.getPageableProductsByCategoryId(
        this.categoryId,this.productsCurrentPage,this.productsPageSize
        ).pipe(finalize(()=>{
          this.productsLoading = false ;
          (ev as InfiniteScrollCustomEvent).target.complete();
        }),map((message:MessageResponse)=>{
          const products = message.list.map((product:IProductResponse)=>{
            product.product_image = product.product_image !== undefined && product.product_image !== '' ? `${this.apiService.apiHost}${product.product_image}` : '../../assets/images/no-image.jpg';
             return product;
          });
          this.productsLoading = false ;
          return products;
        })).subscribe({next : (productsArr)=>{
          this.products.push( ... productsArr);
        } , error : err =>{
          console.log(err);
          this.productsLoading = false ;
          setTimeout(()=>  (ev as InfiniteScrollCustomEvent).target.complete(),1000);
      } });

    }

  }


  onIonInfinite(ev:any) {

    if(this.productsLoading) return;

    const noMoreDataToFetch = (this.products!.length == this.productsCount);

    if(noMoreDataToFetch){
      (ev as InfiniteScrollCustomEvent).target.complete();
      // (ev as InfiniteScrollCustomEvent).target.disabled = true ;
    }
    else{
      setTimeout(() => {
        this.loadMoreProducts(ev);
      }, 1000);
    }
      
   
  }
}
