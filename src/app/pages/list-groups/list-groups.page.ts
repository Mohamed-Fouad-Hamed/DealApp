import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule , LoadingController} from '@ionic/angular';
import { finalize, map, Subscription } from 'rxjs';
import { Router,RouterLink } from '@angular/router';
import { GroupService } from 'src/app/services/model-services/group-service/group.service';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { APIService } from 'src/app/services/API/api.service';
import { IUserResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { IGroupResponse } from 'src/app/interfaces/DB_Models';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-list-groups',
  templateUrl: './list-groups.page.html',
  styleUrls: ['./list-groups.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule , TranslateModule , RouterLink]
})

export class ListGroupsPage implements OnInit,OnDestroy {

  private router = inject(Router);
  private groupService = inject(GroupService);
  private authService = inject(AuthenticationService);
  private apiService = inject(APIService);


 private observableUser? : IUserResponse;

  images?:string[] = [];
  groups?:IGroupResponse[] = [];

  private userSubscription?:Subscription;
  private groupsSubscription?:Subscription;
  private subscription? : Subscription;
  
  constructor( private loadingCtrl : LoadingController ) { }

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
  async ngOnInit() {

    this.initiUser();
   
   }
 
   initiUser(){
     this.showLoading();
     this.authService.getUserAuth().subscribe((oUser)=>{
       this.observableUser = oUser;
       this.initiGroups(this.observableUser!.account_type);
     });
      
   }
 
   initiGroups(account_type:string){
 
     this.groupService.getGroupsByAccountType(account_type)
         .pipe(finalize(()=>{
          setTimeout(()=> this.hideLoading() ,1000);
         }), map((res:IGroupResponse[])=>{
            const groups = res.map((group:any)=> { 
              const groupImage =  group.product_image !== undefined 
              && group.img !== '' ? `${this.apiService.apiHost}${group.img}` : 'assets/images/no-pictures.png'; 
               group.img = groupImage ; 
               return group;
             } );
 
             return groups;
           }))
         .subscribe({next:(groups)=>{
             this.groups! = groups;
 
     },error:(err)=>{
          console.log(err);
          setTimeout(()=> this.hideLoading() ,1000);
     }});
 
   }

  ngOnDestroy(): void {
    if(this.subscription)
      this.subscription.unsubscribe();
    if(this.groupsSubscription)
      this.groupsSubscription.unsubscribe();
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
  }

  navigateTo(url:string){
    this.router.navigate([url]);
  }

  groupClicked(event:any){
     this.navigateTo(`/home/main-page/group-details/${event.id}`)
  }


}
