export interface Item {
    id?:string;
    name?:string;
    text: string;
    value: string;
    des? :string;
    icon?:string;
    exists?:boolean;
  }

  export interface AbstractItem {
    id:number;
    name:string;
  }

  export interface SingleItem{
    id:string ;
    name:string;
    icon:string;
  }

  export interface AccountProductItem{
    productId : number ;
    product_name : string;
    product_image  : string;
    notUpdate?:boolean ;
 }

  export interface AccountProductDetail{
     productId : number ;
     product_name : string;
     descr?  : string;
     category_name?  : string;
     product_image  : string;
     has_first?  : boolean;
     first_unit? : string ;
     first_price? : number;
     has_second?  : boolean;
     second_unit? : string;
     second_price? : number;
     uomPriceList? : UomPrice[];
     uomAccountPriceList? : UomAccountPrice[];
  }

  export interface UomPrice{
        id: number;
        uom_id: number;
        unit_name: string;
        base_cost : number;
        base_price : number;
        reduce_per : number;
        cost_price : number;
        price : number;
  }

  export interface UomAccountPrice {
        uom_id: number;
        base_cost : number;
        base_price : number;
        reduce_per : number;
        cost_price : number;
        price : number;
  }

  export interface QuantityIdx{
    idx:number;
    quan:number;
  }