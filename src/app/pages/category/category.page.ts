import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { ICategoryPost } from 'src/app/interfaces/DB_Models';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CategoryPage implements OnInit {

  @ViewChild('categoryForm') public categoryFrm!: NgForm;
 
  private authService = inject(AuthenticationService);

  private router = inject(Router);

  isLoading : boolean = false ;

  category:ICategoryPost = {
          id:0,
          name:'',
          descr:'',
          account_type:''
        };

  constructor() { }

  ngOnInit() {
  }

  async  onSubmit() {

  }

}