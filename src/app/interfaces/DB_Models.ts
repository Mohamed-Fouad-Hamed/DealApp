export interface IRowStates{
   pendingCount:number;
   acceptCount:number;
   rejectCount:number;
}

export interface IDBUser{
    id:number;
    login:string;
    name:string;
    token:string;
}

export interface IGroupRequest{
    name:string;
    descr:string;
    account_type:string;
}

export interface IGroupResponse{
    id:number;
    name:string;
    descr:string;
    img:string;
    accountType:string;
}

export interface ICategoryRequest{
    id:number;
    name:string;
    descr:string;
    account_type:string;
    group_id:number;
}

export interface ICategoryResponse{
    id:number;
    name:string;
    descr:string;
    img:string;
    accountType:string;
}

export interface IProductRequest{
    name:string;
    descr:string;
    has_first:boolean;
    first_unit:string;
    first_price:number;
    unit_count:number;
    has_second:boolean;
    second_unit:string;
    second_price:number;
    category_id:number;
    factory_id?:number;
}

export interface IProductResponse{
    id:number;
    name:string;
    descr:string;
    has_first:boolean;
    first_unit:string;
    first_price:number;
    unit_count:number;
    has_second:boolean;
    second_unit:string;
    second_price:number;
    product_image:string;
}

export interface IAccountProduct{
    accountId : number;
    productId : number;
    has_first : boolean;
    first_price : number;
    has_second : boolean;
    second_price : number;
}

export interface IAccountOfferReq{

          id : number ;

          accountId : number;

          off_name : string;

          o_date : string;

          startAt : string;

          endAt : string;

          is_active : boolean;
          
       //   offerDetailsList : IOfferDetailsReq[];
}

export interface IOfferDetailsReq{
     id : number;
     offer_id : number;
     product_id : number;
     unit : string;
     max_quan : number;
     max_limit : number;
     percent_discount : number; 
     price : number;
     o_price : number;
}

export interface IAccountOfferRes{

    id : number ;

    accountId : number;

    off_name : string;

    o_date : Date;

    startAt : Date;

    endAt : Date;

    o_image : string;

    occasion_image : string ;

    is_active : boolean;
    
    offerDetailsList : IOfferDetailsRes[];
}

export interface IOfferDetailsRes{
    id : number;
    offer_id:number;
    product_id : number;
    product_name:string;
    product_image:string;
    unit : string;
    max_quan : number;
    max_limit : number;
    percent_discount : number; 
    price : number;
    o_price : number;
}

//=== account products

export interface IOrderProduct{
    account_id : number;
    product_id : number;
    product_name : string;
    product_image : string;
    unit : string;
    price : number;
    has_offer : boolean;
    max_quan : number;
    max_limit : number;
    percent_discount : number; 
    o_price : number;
    order_index? : number ;
    product_index? : number;
    quan_req? : number ;
}

//=== Order Classes

export interface IOrder{
    id : number ;
    seller_id  : number ;
    seller_name  : string ;
    buyer_id  : number ;
    buyer_name  : string ;
    ord_date : string ;
    min_value : number ;
    min_quan : number ;
    delivery_period : string ;
    cash_back : number ;
    is_valid : boolean ;
    payment_id : number ;
    pending : boolean ;
    cancel : boolean ;
    accept : boolean ;
    reject:boolean;
    on_road : boolean ;
    receive : boolean ;
    start_at : string ;
    end_at : string ;
    rating : number ;
    orderDetails : IOrderDetails[];
}

export interface IOrderDetails{
    id : number;
    ord_id:number;
    product_id : number;
    product_name:string;
    product_image:string;
    unit : string;
    max_quan : number;
    max_limit : number;
    percent_discount : number; 
    has_offer : boolean;
    quan : number ;
    price : number ;
    subTotal : number ;
    o_quan : number ;
    o_price : number ;
    o_subTotal : number ;
}


export class Order  {

    id: number = 0;
    seller_id : number= 0;
    seller_name : string = '';
    seller_image : string = '';
    currency : string ='';
    buyer_id : number= 0;
    buyer_name : string = '';
    ord_date : string =  new Date().toISOString() ;
    min_value: number = 0;
    min_quan : number =  0;
    delivery_period : string = '';
    cash_back : number= 0;
    is_valid : boolean = false;
    payment_id : number= 0;
    pending  : boolean = true;
    cancel : boolean  = false;
    accept : boolean  = false;
    reject : boolean  = false;
    on_road : boolean  = false;
    receive : boolean  = false;
    start_at : string =  new Date().toISOString();
    end_at : string =  new Date().toISOString();
    total : number = 0;
    payment : number = 0 ;
    remainder : number = 0 ;
    rate_seller : number = 0 ;
    rate_buyer : number = 0 ;
    orderDetails : OrderDetails[] = [];

    get productsCount():number{
        return this.orderDetails.length;
    }

    get productsValue():number {
     this.total =   this.orderDetails
                        .map((current)=>{ return current.subTotal + current.o_subTotal ;})
                        .reduce((accumulator, current) => accumulator + current ,0);  
     return this.total ;
    }

    get isValidQuan():boolean{
        let result = false;
        result = this.productsCount >= this.min_quan ;
        return result;
    }

    get validQuanInfo():string{
       return `${this.productsCount + '\/' + this.min_quan}` 
    }

    get isValidValue():boolean{
        return this.productsValue >= this.min_value ;
    }

    get ValidValueInfo():string{
        return `${this.min_value.toFixed(2) + '\/' + this.productsValue.toFixed(2)}` 
    }

    get progressTotalValue() : number{
        return Number.parseFloat((this.productsValue/this.min_value).toFixed(2));
    }

    get notValidQuan():number {
        const result = this.min_quan - this.productsCount ;
        return result <= 0 ? 0 : result ;  
    }

    get notValidValue():number {
        const result = this.min_value - this.productsValue ;
        return result <= 0 ? 0 : result ;  
    }

}

export class OrderDetails {
    
    id: number = 0 ;
    ord_id: number = 0;
    product_id: number = 0;
    product_name: string = '';
    product_image: string ='';
    unit: string ='';
    max_quan: number = 0;
    max_limit: number = 0;
    percent_discount: number = 0;
    has_offer: boolean = false;
    quan: number = 0;
    price: number = 0;
    subTotal: number = 0;
    o_quan: number = 0;
    o_price: number = 0;
    o_subTotal: number = 0;
    _totalQuan :number = 0 ;
    orderProduct?:IOrderProduct;

  private calcSubTotal() : void {
        this.subTotal = 
        (!Number.isNaN(this.quan) && this.quan > 0 ) &&
        (!Number.isNaN(this.price) && this.price > 0 ) ? 
        this.quan * this.price : 0 ;
    }

   private calcO_SubTotal() : void {
        this.o_subTotal = 
        (!Number.isNaN(this.o_quan) && this.o_quan > 0 ) &&
        (!Number.isNaN(this.o_price) && this.o_price > 0 ) ? 
        this.o_quan * this.o_price : 0 ;
    }

    calcDetail() : void{
        this._totalQuan =  this.quan + this.o_quan ;
        this.calcSubTotal();
        this.calcO_SubTotal();

    }

    get totalQuan():number{
        return this._totalQuan;
    }

    get totalValue():number{
        return this.subTotal + this.o_subTotal ;
    }

    get isValidMaxLimit():boolean {
        return this.totalQuan === ( this.max_limit >= this.max_quan ? this.max_limit : this.max_quan) ;
    }

    
}

export interface IOrderReq {
    id : number ;
    seller_id  : number ;
    buyer_id  : number ;
    ord_date : string ;
    min_value : number ;
    min_quan : number ;
    delivery_period : string ;
    cash_back : number ;
    is_valid : boolean ;
    payment_id : number ;
    pending : boolean ;
    cancel : boolean ;
    accept : boolean ;
    reject:boolean;
    on_road : boolean ;
    receive : boolean ;
    start_at : string ;
    end_at : string ;
    total : number ;
    payment : number ;
    remainder : number ;
    rate_seller : number ;
    rate_buyer : number ;
    orderDetailsReqList : IOrderDetailsReq[];  
}

export interface IOrderDetailsReq{
    id : number;
    ord_id : number;
    product_id : number;
    unit : string;
    max_quan : number;
    max_limit : number;
    percent_discount : number; 
    quan : number ;
    price : number ;
    o_quan : number ;
    o_price : number ;
}

export interface IOrderOptionReq{
    orderId:number;
    valueChanged:boolean;
  }

  export interface IOrderRateReq{
    orderId:number;
    rate:number;
  }

 export interface IOrderPaymentReq{
    orderId : number ;
    paymentId : number ;
    payment : number ;
 }

 export function fromOrderToOrderReq(order:Order){
   
    const orderReq : IOrderReq = {
        id : order.id ,
        seller_id  : order.seller_id ,
        buyer_id  : order.buyer_id ,
        ord_date : order.ord_date ,
        min_value : order.min_value ,
        min_quan :  order.min_quan ,
        delivery_period :  order.delivery_period ,
        cash_back :  order.cash_back ,
        is_valid :  order.is_valid ,
        payment_id :  order.payment_id ,
        pending : order.pending ,
        cancel :  order.cancel ,
        accept :  order.accept ,
        reject:  order.reject ,
        on_road :  order.on_road ,
        receive :  order.receive ,
        start_at :  order.start_at ,
        end_at :  order.end_at ,
        total :  order.total ,
        payment :  order.payment ,
        remainder :  order.remainder ,
        rate_seller :   order.rate_seller ,
        rate_buyer :   order.rate_buyer ,
        orderDetailsReqList : order.orderDetails.map((detail)=>{
            const _detail:IOrderDetailsReq = {
                id : detail.id,
                ord_id: order.id,
                product_id : detail.product_id ,
                unit :  detail.unit ,
                max_quan :  detail.max_quan ,
                max_limit :  detail.max_limit ,
                percent_discount :  detail.percent_discount ,
                quan :  detail.quan ,
                price :  detail.price ,
                o_quan :  detail.o_quan ,
                o_price :  detail.o_price 
            }
            return _detail;
        }) 
    }

    return orderReq ;
 }