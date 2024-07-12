import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/model-services/category-service/category.service';
import { ICategoryResponse } from 'src/app/interfaces/DB_Models';
import { Subscription, finalize } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';

@Component({
  selector: 'app-category-profile',
  templateUrl: './category-profile.page.html',
  styleUrls: ['./category-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CategoryProfilePage implements OnInit ,OnDestroy {

  private id : string = '';

  private route = inject(ActivatedRoute);

  private categoryService = inject(CategoryService);

  public currentCategory :  ICategoryResponse ={ id:0,name:'',descr:'',img:'',accountType:''}

  public imageUrl:string ='';

  private subscription? : Subscription;
  private imageSubscription? : Subscription;


  constructor(    
    private apiService:APIService,
    private modalCtrl: ModalController
  ) { 
   
  }

  ngOnDestroy(): void {
    if( this.subscription) this.subscription!.unsubscribe();
    if( this.imageSubscription) this.imageSubscription!.unsubscribe();
  }

 async ngOnInit() {

    this.route.paramMap.subscribe((params)=>{
      this.id = params.get('id') || '';
    });
     
    this.subscription = this.categoryService.getCategory(this.id)
                                            .subscribe((category:ICategoryResponse) =>{ 
                                              this.currentCategory = category 
                                              this.imageUrl = `${this.apiService.apiHost}${this.currentCategory?.img}` ;
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
        const fileName = `image-category.${data.type.split('\/')[1]}`;
        formData.append('image',data,fileName);
        formData.append('id',this.id);
        this.imageSubscription = this.categoryService.uploadCategoryImage(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res:any)=>{
          this.currentCategory = res.entity;
          this.imageUrl = `${this.apiService.apiHost}${this.currentCategory?.img}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.imageUrl = `${this.apiService.apiHost}${this.currentCategory?.img}` 
        }});
    }
  }


}
