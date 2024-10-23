import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { AccountProductItem } from 'src/app/types/types';
import { CategoryService } from 'src/app/services/model-services/category-service/category.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.page.html',
  styleUrls: ['./list-products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListProductsPage implements OnInit ,OnDestroy{

  private groupId:string = '';
  products:AccountProductItem[] = [] ;

  private route = inject(ActivatedRoute);
  private subscription? : Subscription;
  private productsSubscription? : Subscription;

  private categoryService = inject(CategoryService);

  constructor() { }

  async ngOnInit() {

    this.subscription =  this.route.paramMap.subscribe((params)=>{
      this.groupId = params.get('groupId') || '';
    });
    
    this.productsSubscription = 
    this.categoryService.getCategoriesByGroup(this.groupId).pipe(map((products:any)=> {
          const _products = products.list.map((_product:any)=>{ 
            const product:AccountProductItem = {
            productId: _product.productId,
            product_name: _product.product_name,
            product_image: _product.product_image 
          };
            return product;
      });
          return _products;
    })).subscribe((_products:AccountProductItem[]) => {     
                  this.products = _products;        
    });

  }

  ngOnDestroy(): void {
    if( this.subscription) this.subscription!.unsubscribe();
    if( this.productsSubscription) this.productsSubscription!.unsubscribe();
  }
}
