import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {  Photo } from '@capacitor/camera';
import { IonicModule , ModalController } from '@ionic/angular';
import { PhotoService } from 'src/app/services/Photos/PhotoService';
import { CommonModule } from '@angular/common';
//import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss'],
  standalone:true,
  imports: [IonicModule, CommonModule]
})
export class SelectImageComponent  implements OnInit {


  photo:string = '';

  imageData! : Photo | undefined;

  imageBlob : Blob | undefined;

  @ViewChild('photoTaked') public img?: ElementRef;

  constructor(private photoService:PhotoService , private modalCtrl: ModalController ) { }


  ngOnInit() {}

  async selectImageFromCamera(){
    const curPhoto = await this.photoService.getImageFromCamera(); 
       this.setPhoto(curPhoto);
  }

  async selectImageFromGallery(){
    const curPhoto = await this.photoService.getImageFromGallery();  
    this.setPhoto(curPhoto);
  }

  async resetImage(){
    this.photo = '';
    this.imageData = undefined;
  }

  private async setPhoto(photo:Photo | undefined){ 
    if(!photo)
        return;
    this.imageBlob  = await this.photoService.getBlob(photo);    
    const imageAsBase64 =  await this.photoService.ImageAsBase64(photo);



    const image = new Image();
    

    image.onload = () => {
      
      const base64str = image.src.substring(22);

      const decoded = atob(base64str);
      
      console.log(`image loaded width = ${image.width} , height = ${image.height} , size = ${decoded.length}`);

      this.photo = image.src ;   //`${imageAsBase64.base64}`;

    };

    image.src = `${imageAsBase64.base64}`;


    
  }

  /*
  async uploadImage(formData:FormData , url :string){
    this.http.post(url,formData).pipe(finalize(() =>{

    })).subscribe(
      (res:any) => this.photo = `http://localhost:8080${res.entity.user_avatar}` 
    );

  }
*/

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.imageBlob, 'confirm');
  }

}
