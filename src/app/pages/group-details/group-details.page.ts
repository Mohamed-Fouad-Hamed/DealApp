import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , InfiniteScrollCustomEvent } from '@ionic/angular';
import { finalize, map, Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/model-services/category-service/category.service';
import { ICategoryResponse, IProductResponse } from 'src/app/interfaces/DB_Models';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';
import { ActivatedRoute } from '@angular/router';
import { MessagePageableResponse, MessageResponse } from 'src/app/services/interfaces/MessageResponse';
import { APIService } from 'src/app/services/API/api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class GroupDetailsPage implements OnInit ,OnDestroy{

  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private apiService = inject(APIService);

  public categories :  ICategoryResponse[] = [] ;
  public products : IProductResponse[] = [];

  productsCurrentPage : number = 0;
  productsPageSize : number = 12;
  productsCount : number = 0;

  categoriesSubscription?:Subscription;
  productsSubscription?:Subscription;
 
  private groupId : string = '';

  private categoryId : string = '';

  private route = inject(ActivatedRoute);

  categoriesLoading : boolean = true;

  productsLoading  : boolean = true ;

  selectAllCategories : boolean = true ;

  constructor() { }

  ngOnDestroy(): void {
    if(this.categoriesSubscription)
      this.categoriesSubscription.unsubscribe();
    if(this.categoriesSubscription)
      this.categoriesSubscription.unsubscribe();
  }

 async  ngOnInit() {

      this.route.paramMap.subscribe((params)=>{
        this.groupId = params.get('groupId') || '';
      });
       
  }

  private async initiCategoriesByGroup(){

   this.categoriesSubscription! = this.categoryService.getCategoriesByGroup(this.groupId)
                        .pipe(finalize(()=>{ this.categoriesLoading = false ;  }))
                        .subscribe((categoriesArr)=>{
                          this.categories = categoriesArr ;
                        });
  }

  private async initiProducts() {

    this.productsLoading = true ;

    this.productsSubscription! = this.productService.getCountAndPageableProductsByGroupId(
                                                    this.groupId,this.productsCurrentPage,this.productsPageSize
                                                    ).pipe(map((message:MessagePageableResponse)=>{
                                                      this.productsCount = message.count;
                                                      const products = message.list.map((product:IProductResponse)=>{
                                                         product.product_image = `${this.apiService.apiHost}${product.product_image}`;
                                                         return product;
                                                      });
                                                      this.productsLoading = false ;
                                                      return products;
                                                    })).subscribe((productsArr)=>{
                                                       this.products = productsArr;
                                                    });
     
  }

  selectAllButtonClicked(){

    this.productsCurrentPage = 0 ;

    this.productsLoading = true ;

    this.selectAllCategories = true ;

    this.initiProducts();

  }



  segmentButtonClicked(category:ICategoryResponse){

    this.productsCurrentPage = 0 ;

    this.productsLoading = true ;

    this.selectAllCategories = false ;

    this.categoryId = ''+category.id;

    this.productsSubscription! = this.productService.getCountAndPageableProductsByCategoryId(
      this.categoryId,this.productsCurrentPage,this.productsPageSize
      ).pipe(map((message:MessagePageableResponse)=>{
        this.productsCount = message.count;
        const products = message.list.map((product:IProductResponse)=>{
           product.product_image = `${this.apiService.apiHost}${product.product_image}`;
           return product;
        });
        this.productsLoading = false ;
        return products;
      })).subscribe((productsArr)=>{
         this.products = productsArr;
      });
  }

  loadMoreProducts(){

    this.productsCurrentPage++;

    this.productsLoading = true ;

    if(this.selectAllCategories){

      this.productsSubscription! = this.productService.getPageableProductsByGroupId(
       
        this.groupId,this.productsCurrentPage,this.productsPageSize

        ).pipe(map((message:MessageResponse)=>{
          const products = message.list.map((product:IProductResponse)=>{
             product.product_image = `${this.apiService.apiHost}${product.product_image}`;
             return product;
          });
          this.productsLoading = false ;
          return products;
        })).subscribe((productsArr)=>{
           this.products = productsArr;
        });


    }else{

      this.productsSubscription! = this.productService.getPageableProductsByCategoryId(
        this.categoryId,this.productsCurrentPage,this.productsPageSize
        ).pipe(map((message:MessageResponse)=>{
          const products = message.list.map((product:IProductResponse)=>{
             product.product_image = `${this.apiService.apiHost}${product.product_image}`;
             return product;
          });
          this.productsLoading = false ;
          return products;
        })).subscribe((productsArr)=>{
           this.products = productsArr;
        });

    }

  }


  onIonInfinite(ev:any) {
    const noMoreDataToFetch = (this.products!.length == this.productsCount);

    if(noMoreDataToFetch)
      (ev as InfiniteScrollCustomEvent).target.disabled = true;
    else{
      this.loadMoreProducts();
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 1000);

    }
      
   
  }
}
