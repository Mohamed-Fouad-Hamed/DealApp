import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SupplierCardComponent } from 'src/app/components/supplier-card/supplier-card.component';
import { AccountService } from 'src/app/services/model-services/account/account.service';
import { map, Subscription } from 'rxjs';
import { IAccountResponse } from 'src/app/services/interfaces/Auth-Interfaces';
import { AuthenticationService } from 'src/app/services/Auth-services/authentication.service';
import { APIService } from 'src/app/services/API/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suppliers-page',
  templateUrl: './suppliers-page.page.html',
  styleUrls: ['./suppliers-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule  , TranslateModule, SupplierCardComponent]
})
export class SuppliersPagePage implements OnInit , OnDestroy{

  private authenService = inject(AuthenticationService);

  private apiService = inject(APIService);

  accountService = inject(AccountService);

  suppliers! : IAccountResponse[] ;

  subscription! : Subscription ;

  subscriptionAuth! : Subscription; 

  private router = inject(Router);

  constructor() { }


  ngOnDestroy(): void {
    if(this.subscription)
       this.subscription.unsubscribe();
    if(this.subscriptionAuth)
      this.subscriptionAuth.unsubscribe();  
  }

  async ngOnInit() {
       this.subscriptionAuth = 
                              this.authenService
                              .getUserObservable
                              .subscribe((oUser)=>{

               const {account_type} = oUser ;
               const { account_id } = oUser;

               console.log(oUser);

               this.getAccountsByType(account_type, account_id );

           });   

  }

  getAccountsByType(type:string,id:number){

    this.subscription = this.accountService
                            .getAccountsByAccountType(type,[id])
                            .pipe(map((accounts:any)=>{

                                const accountsArr = accounts.map((account:IAccountResponse)=>{
                                    account.account_logo = `${this.apiService.apiHost}${account.account_logo}` ;
                                    return account;
                                });

                                return accountsArr;
                            }))
                            .subscribe((accounts)=> this.suppliers = accounts );
  }

  supplierClicked(accountId:number){
    const url = `${'home\/products-by-account\/'+accountId}`;
    this.router.navigateByUrl(url);
  }
}


