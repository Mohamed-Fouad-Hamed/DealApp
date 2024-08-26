import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupService } from 'src/app/services/model-services/group-service/group.service';
import { Router, RouterLink } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { IGroupRequest, IGroupResponse } from 'src/app/interfaces/DB_Models';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncCategoryNameIsUniqueDirective } from 'src/app/validations/directives/AsyncCategoryNameIsUnique';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,TranslateModule,RouterLink,RouterLink,AsyncCategoryNameIsUniqueDirective]
})
export class GroupPage implements OnInit {

  @ViewChild('groupFrm') public groupFrm!: NgForm;

  private groupService = inject(GroupService);

  private router = inject(Router);

  err:string ='';

  isLoading : boolean = false ;

  private subscription? : Subscription;

  groupRequest:IGroupRequest = {
          id:0,
          name:'',
          descr:'',
          account_type:''
        };

  groupResponse:IGroupResponse = {
          id:0,
          name:'',
          descr:'',
          img:'',
          accountType:''
        };  
        
  isToastOpen = false;

  setOpenToast(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  constructor(   ) { }

  ngOnDestroy(): void {
    if( this.subscription) this.subscription!.unsubscribe();
  }

  ngOnInit() {    
  }

  async  onSubmit() {
    if (this.groupFrm.invalid) {
      return;
    }

    this.isLoading = true;
    
    try{
   
    this.subscription =  this.groupService.uploadGroup(
        this.groupRequest
      ).pipe(finalize(() => {
        setInterval(
          () => {
            this.isLoading = false;
          },
          2000
        );
      }))
        .subscribe({
          next: (res) => {
            
            if (res.status === 200) {
               const{id} = res.entity;
               this.setOpenToast(true)
               setTimeout(()=> {this.router.navigate([`/group-profile/${id}`])},2000)
            }

          },
          error: (err) => { console.log(err); this.err = err.message; }
        }
        );

    }catch( e:any){
      this.err = e.message;
    
    }

   
  }

  onReset(): void {
    this.groupFrm.reset();
  }


}
