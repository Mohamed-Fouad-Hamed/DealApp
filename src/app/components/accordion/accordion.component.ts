import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule ,MenuController,NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  standalone:true,
  imports:[IonicModule , CommonModule]

})
export class AccordionComponent  implements OnInit {

  @Input() item:any ;
  @Input() parent = '';

  private router = inject(Router);
  private menuCtrl = inject(MenuController);
  private navCtrl = inject(NavController);

  constructor() { }

  ngOnInit() {
    if(this.parent === '')
      this.parent = this.item.name;
    else
      this.parent += `/${this.item.name}`;
  }

  async navigateToUrl(path:string){
    const fullPath = `${this.parent}/${path}`;
    const encode = encodeURIComponent(fullPath);
    this.navCtrl.setDirection('root');
    this.router.navigateByUrl(`home/${encode}`);
    this.menuCtrl.toggle();
 }

}
