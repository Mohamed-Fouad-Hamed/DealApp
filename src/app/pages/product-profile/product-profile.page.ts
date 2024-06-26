import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule ,ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/model-services/product-service/product.service';
import { IProductResponse } from 'src/app/interfaces/DB_Models';
import { Subscription, finalize } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';
import { MessageResponse } from 'src/app/services/interfaces/MessageResponse';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.page.html',
  styleUrls: ['./product-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductProfilePage implements OnInit {

  private id : string = '';

  private route = inject(ActivatedRoute);

  private productService = inject(ProductService);

  public currentProduct :  IProductResponse ={ id:0,name:'',descr:'',   has_first:false,
    first_unit:'',
    first_price:0,
    has_second:false,
    second_unit:'',
    second_price:0,product_image:''}

  public imageUrl:string ='';

  private subscription? : Subscription;
  private imageSubscription? : Subscription;


  constructor(    
    private apiService:APIService,
    private modalCtrl: ModalController
  ) { 
   
  }

  ngOnDestroy(): void {
    this.subscription!.unsubscribe();
    this.imageSubscription!.unsubscribe();
  }

 async ngOnInit() {

    this.route.paramMap.subscribe((params)=>{
      this.id = params.get('id') || '';
    });
     
    this.subscription = this.productService.getProduct(this.id)
                                            .subscribe((msg:MessageResponse) =>{ 
                                              this.currentProduct = msg.entity 
                                              this.imageUrl = `${this.apiService.apiHost}${this.currentProduct?.product_image}` ;
                                            });
  }

  async openModalImage() {

    const modal = await this.modalCtrl.create({
      component: SelectImageComponent,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.imageUrl = '';
      const formData:FormData = new FormData();
        const fileName = `image-product.${data.type.split('\/')[1]}`;
        formData.append('image',data,fileName);
        formData.append('id',''+this.id);
        this.productService.uploadProductImage(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res)=>{
          this.currentProduct = res.entity;
          this.imageUrl = `${this.apiService.apiHost}${this.currentProduct?.product_image}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.imageUrl = `${this.apiService.apiHost}${this.currentProduct?.product_image}` 
        }});
    }
  }



}
