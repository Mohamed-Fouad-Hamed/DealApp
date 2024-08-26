import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { IGroupResponse } from 'src/app/interfaces/DB_Models';
import { Subscription, finalize } from 'rxjs';
import { APIService } from 'src/app/services/API/api.service';
import { SelectImageComponent } from 'src/app/modals/select-image/select-image.component';
import { GroupService } from 'src/app/services/model-services/group-service/group.service';

@Component({
  selector: 'app-group-profile',
  templateUrl: './group-profile.page.html',
  styleUrls: ['./group-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GroupProfilePage implements OnInit {

  private id : string = '';

  private route = inject(ActivatedRoute);

  private groupService = inject(GroupService);

  public currentGroup :  IGroupResponse ={ id:0,name:'',descr:'',img:'',accountType:''}

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
     
    this.subscription = this.groupService.getGroup(this.id)
                                            .subscribe((group:IGroupResponse) =>{ 
                                              this.currentGroup = group 
                                              this.imageUrl = `${this.apiService.apiHost}${this.currentGroup?.img}` ;
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
        const fileName = `image-group.${data.type.split('\/')[1]}`;
        formData.append('image',data,fileName);
        formData.append('id',this.id);
        this.imageSubscription = this.groupService.uploadGroupImage(formData).pipe(finalize(()=>{
          console.log(' finally ... ')
        })).subscribe({
          next:(res:any)=>{
          this.currentGroup = res.entity;
          this.imageUrl = `${this.apiService.apiHost}${this.currentGroup?.img}` 
        },error:(error:any)=>{
          console.log(error)
        },complete:()=>{
          this.imageUrl = `${this.apiService.apiHost}${this.currentGroup?.img}` 
        }});
    }
  }

}
