import { CommonModule } from '@angular/common';
import { IonicModule , AnimationController ,IonInput } from '@ionic/angular';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  standalone: true,
  imports : [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class SearchableSelectComponent  implements OnInit,AfterViewInit,OnChanges {

   @ViewChild('inputSearch') input!: IonInput;

  @Input() value!: number;
  @Output() valueChange = new EventEmitter<number>();

  @Input() title: string = 'Search';
  @Input() placeholder!: string  ;
  @Input() data!:any[] ;
  @Input() multiple:boolean = false ;
  @Input() itemTextField: string = 'name';
  @Input() itemValueField: string = 'id';
  @Output() selectedChanged : EventEmitter<any> = new EventEmitter();

  valueString!:string;

  isOpen:boolean = false ;

  selected : any[] = [] ;
  filtered : any[] = [] ;

  constructor(private animationCtrl: AnimationController ) {
    
   }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['value']){
      this.selectItemsByValue();
    }
      
  }

  ngOnInit(): void {
    this.selectItemsByValue();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if(this.input){
      this.input.setFocus();
    }
    }, 1000);
  }

  open(){
    this.selectItemsByValue();
    this.isOpen = true;
  }

  cancel(){
    this.isOpen = false;
  }

  select(){

      const selected = this.data.filter((item)=> item.selected);

      this.selected = selected ;

      this.selectedChanged.emit(selected);

      this.valueString = this.selected.map((item) => this.leav(item)).join(',') ;

     // this.valueChange.emit(itemSelected);

      this.isOpen = false;
  }

  leaf = (obj:any) => this.itemTextField.split('.').reduce((value,el) => value[el], obj);

  leav = (obj:any) => this.itemValueField.split('.').reduce((value,el) => value[el], obj);

  itemSelected(){

    if(!this.multiple){

      if( this.selected?.length  > 0 ){
          this.selected[0].selected = false;
      }

       this.selected =  this.filtered.filter((item)=> item.selected === true);
    
       this.selectedChanged.emit(this.selected);

       const itemSelected = this.selected && this.selected.length ? this.selected.map((item) => this.leav(item))[0] : 0 ;

       this.valueChange.emit(itemSelected);
      
       this.isOpen = false;
    
    }
  }

  filter(event : CustomEvent){

    const filter = event.detail.value?.toLowerCase();

    this.filtered = this.data.filter(item => this.leaf(item).toLowerCase().indexOf(filter) >= 0 );

  }


  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);



    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);

 
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };


  selectItemsByValue(){

    const nativeData = this.data.map((item)=> { 
      item.selected = false; 
      return item;
    } );
    this.filtered = [... nativeData];

    const arrayFromValue = [this.value] ; //this.valueString.split(',').map((id) => +id);
    //this.filtered.filter(item => arrayFromValue.includes(this.leav(item))).map(item => item.selected = true);
    //this.selected = this.filtered.filter((item)=> item.selected);
    this.selected =  this.filtered.filter(item => arrayFromValue.includes(this.leav(item)));
    this.selected.map((item=> item.selected = true))
  }

}
