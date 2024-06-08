import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule , ModalController} from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IProductPost } from 'src/app/interfaces/DB_Models';
import { APIService } from 'src/app/services/API/api.service';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class ProductPage implements OnInit {

  @ViewChild('productForm') public productFrm!: NgForm;
 
  isLoading : boolean = false ;

  imageUrl:string = '';

  accountId:string = '';

  product:IProductPost = {
          id:0,
          name:'',
          descr:'',
          has_first:false,
          first_unit:'',
          first_price:0,
          has_second:false,
          second_unit:'',
          second_price:0,
          category_id:0
        };

  constructor(
    private apiService:APIService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async  onSubmit() {

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
        const fileName = `image-user.${data.type.split('\/')[1]}`;
        formData.append('image',data,fileName);
        formData.append('id',this.accountId);
        this.authService.userUploadImage(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res)=>{
          this.currentUser = res.entity;
          this.imageUrl = `${this.apiService.apiHost}${this.currentUser?.user_image}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.imageUrl = `${this.apiService.apiHost}${this.currentUser?.user_image}` 
        }});
    }
  }
}
