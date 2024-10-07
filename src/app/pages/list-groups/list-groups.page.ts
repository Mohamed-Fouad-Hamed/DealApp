import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { map, Subscription } from 'rxjs';
import { Router } from '@angular/router';
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
  imports: [IonicModule, CommonModule, FormsModule , TranslateModule]
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
  
  constructor() { 

  }

  async ngOnInit() {

    this.initiUser();
   
   }
 
   initiUser(){
 
     this.authService.getUserAuth().subscribe((oUser)=>{
       this.observableUser = oUser;
       this.initiGroups(this.observableUser!.account_type);
     });
      
   }
 
   initiGroups(account_type:string){
 
     this.groupService.getGroupsByAccountType(account_type)
         .pipe(map((res:IGroupResponse[])=>{
            const groups = res.map((group:any)=> { 
               group.img = `${this.apiService.apiHost}${group.img}` ; 
               return group;
             } );
 
             return groups;
           }))
         .subscribe((groups)=>{
             this.groups! = groups;
 
     });
 
   }

  ngOnDestroy(): void {
    if(this.subscription)
      this.subscription.unsubscribe();
    if(this.groupsSubscription)
      this.groupsSubscription.unsubscribe();
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
  }


}
