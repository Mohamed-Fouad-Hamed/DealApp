import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  public photos: BaseItemPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform! : Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async getImageFromCamera(){

    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    return capturedPhoto;
  }

  public async getImageFromGallery(){
    
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100
    });

    return capturedPhoto;

  }

  public async ImageAsBase64(photo:Photo){

    const base64Data = await this.readAsBase64(photo);
  
      return {
        base64: base64Data
      };

  }


  public async addPhotoFromGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 90
    });

      if(capturedPhoto){
        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);
        this.setPreferences();
    }
  }

  public async addPhotoFromCamera() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90
    });

      if(capturedPhoto){
        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);
        this.setPreferences();
    }
  }

  public async getBlob(photo:Photo){
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return blob;
  }

  public async saveExImage(photo:Photo){
    const savedImageFile = await this.savePicture(photo);
    this.photos.unshift(savedImageFile);
    this.setPreferences();
}

  private async setPreferences(){
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  private async savePicture(photo: Photo) {
     // Convert photo to base64 format, required by Filesystem API to save
      const base64Data = await this.readAsBase64(photo);

      // Write the file to the data directory
      const fileName = Date.now() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: `${fileName}` ,
        data: base64Data,
        directory: Directory.Data
      });

      if (this.platform.is('hybrid')) {
        // Display the new image by rewriting the 'file://' path to HTTP
        // Details: https://ionicframework.com/docs/building/webview#file-protocol
        return {
          filepath: savedFile.uri,
          webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        };
      }
      else {
        // Use webPath to display the new image instead of base64 since it's
        // already loaded into memory
        return {
          filepath: fileName,
          webviewPath: photo.webPath
        };
      }
   }

   private async readAsBase64(photo: Photo) {
      // "hybrid" will detect Cordova or Capacitor
      if (this.platform.is('hybrid')) {
        // Read the file into base64 format
        const file = await Filesystem.readFile({
          path: photo.path!
        });

        return file.data;
      }
      else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
      }
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {
    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as BaseItemPhoto[];
  
    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
        });
        
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async deletePhoto(indexPhoto:number){   
    this.photos.splice(indexPhoto,1);
    this.setPreferences();
  }

}

export interface BaseItemPhoto {
  filepath: string;
  webviewPath?: string;
}
