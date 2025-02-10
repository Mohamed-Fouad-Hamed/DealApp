import { format } from 'date-fns/format';

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
    category_id:number;
    factory_id?:number;
    uom_group:number;
    uom_base:number;
    base_cost:number;
    base_price:number;
    accept:boolean;
    reject:boolean;
}

export interface IUomProductRequest {
    id:number;
    productId:number;
    uomId:number;
    base_cost:number;
    base_price:number;
    reduce_per:number;
    cost_price:number;
    price:number;
    price_auto:boolean;
}

export interface IBarcodeProductRequest {
    id:number;
    productId:number;
    uomId:number;
    uom_barcode:string;
    freetext:string;
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

export interface IAccountProductReq {
    accountId : number;
    productId : number;
    uom_id : number;
    uom_name ? : string;
    base_cost? : number;
    base_price? : number;
    reduce_per? : number;
    cost_price? : number;
    price? : number;
    accountPrice? : number;
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
     unit_id : number;
     max_quan : number;
     max_limit : number;
     percent_discount : number; 
     price : number;
     o_price : number;
}

export interface IAccountOfferRes{

    id : number ;

    accountId : number;

    accountName? : string;

    accountImage? : string;

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
    offer_id : number;
    product_id : number;
    product_name : string;
    product_image : string;
    unit_id? : number ;
    unit : string;
    max_quan : number;
    max_limit : number;
    percent_discount : number; 
    price : number;
    o_price : number;
}

export interface IProductOffer{
    offer_id : number;
    product_id : number;
    product_name : string;
    product_image : string;
    details:IProductOfferDetails[];
}

export interface IProductOfferDetails{
    id : number;
    unit_id : number ;
    unit : string;
    max_quan : number;
    max_limit : number;
    percent_discount : number; 
    price : number;
    o_price : number;
}
//=== account products

export interface IProductGroup{
    account_id : number;
    product_id : number;
    product_name : string;
    product_image : string;
    details : IOrderProduct[] ;
}

export interface IOrderProduct{
    account_id : number;
    product_id : number;
    product_name : string;
    product_image : string;
    unit_id:number;
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
    unit_id : number ;
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
    seller_logo : string = '';
    currency : string ='';
    buyer_id : number= 0;
    buyer_name : string = '';
    buyer_logo : string = '';
    ord_date : string =  format( new Date() ,'yyyy-MM-dd') + 'T' + format( new Date() ,'HH:mm:ss');
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
    start_at : string = format( new Date() ,'yyyy-MM-dd') + 'T' + format( new Date() ,'HH:mm:ss');
    end_at : string = format( new Date() ,'yyyy-MM-dd') + 'T' + format( new Date() ,'HH:mm:ss');
    total : number = 0;
    payment : number = 0 ;
    remainder : number = 0 ;
    rate_seller : number = 0 ;
    rate_buyer : number = 0 ;
    orderDetails : OrderDetails[] = [];
    
    get getStatus() : string {

        let status:string = 'order.pending_status';

        if(this.accept)
            status ='order.accepted_status';
        if(this.cancel)
            status = 'order.cancel_status';
        if(this.reject)
            status = 'order.rejected_status';
        if(this.on_road)
            status = 'order.onroad_status';
        if(this.receive)
            status = 'order.receive_status';

        return status;

    }

    get productsCount():number{

        const uniqueArray = this.orderDetails.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.product_id === value.product_id
            ))
        )

        return  uniqueArray.length ; // this.orderDetails.length;
    }

    productsValue() : number {
     this.total = this.orderDetails
                        .map((current)=>{
                            return current.subTotal + current.o_subTotal ;
                        }).reduce((accumulator, current) => accumulator + current ,0);  
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
        return this.productsValue() >= this.min_value ;
    }

    get ValidValueInfo():string{
        return `${this.min_value.toFixed(2) + '\/' + this.productsValue().toFixed(2)}` 
    }

    get progressTotalValue() : number{
        return Number.parseFloat((this.productsValue()/this.min_value).toFixed(2));
    }

    get notValidQuan():number {
        const result = this.min_quan - this.productsCount ;
        return result <= 0 ? 0 : result ;  
    }

    get notValidValue():number {
        const result = this.min_value - this.productsValue() ;
        return result <= 0 ? 0 : result ;  
    }

}

export class OrderDetails {
    
    id: number = 0 ;
    ord_id: number = 0;
    product_id: number = 0;
    product_name: string = '';
    product_image: string ='';
    unit_id : number = 0 ;
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
    unit_id : number ;
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

  export interface IOrderStatusReq extends IOrderOptionReq{
    orderIndex:number;
    status:string;
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

 export function entityToOrder(_order:any){

    const _ord = new Order();
     
    _ord.id = _order.id;
    _ord.seller_id = _order.seller_id ;
    _ord.seller_name = _order.seller ;
    _ord.seller_logo = _order.seller_logo;
    _ord.currency = _order.currency;
    _ord.buyer_id = _order.buyer_id;
    _ord.buyer_name = _order.buyer_name;
    _ord.buyer_logo = _order.buyer_logo;
    _ord.ord_date = _order.ord_date;
    _ord.min_value = _order.min_value;
    _ord.min_quan = _order.min_quan;
    _ord.delivery_period = _order.delivery_period;
    _ord.cash_back = _order.cash_back;
    _ord.is_valid = _order.is_valid;
    _ord.payment_id = _order.payment_id;
    _ord.pending = _order.pending;
    _ord.cancel = _order.cancel;
    _ord.accept = _order.accept;
    _ord.reject = _order.reject;
    _ord.on_road = _order.on_road;
    _ord.receive = _order.receive;
    _ord.start_at = _order.start_at;
    _ord.end_at = _order.end_at ;
    _ord.payment = _order.payment;
    _ord.remainder = _order.remainder;
    _ord.rate_seller = _order.rate_seller;
    _ord.rate_buyer = _order.rate_buyer;
    _ord.orderDetails = _order.orderDetailsList.map((_detail:any)=>{

      const orderDetails = new OrderDetails();
      orderDetails.id = _detail.id ;
      orderDetails.ord_id = _detail.ord_id ;
      orderDetails.product_id = _detail.product_id ;
      orderDetails.product_name = _detail.product_name ;
      orderDetails.product_image = _detail.product_image ;
      orderDetails.unit_id = _detail.unit_id;
      orderDetails.unit = _detail.unit ;
      orderDetails.percent_discount = _detail.percent_discount ;
      orderDetails.max_quan = _detail.max_quan ;
      orderDetails.max_limit = _detail.max_limit ;
      orderDetails.quan = _detail.quan ;
      orderDetails.price = _detail.price ;
      orderDetails.o_quan = _detail.o_quan ;
      orderDetails.o_price = _detail.o_price ;

      orderDetails.calcDetail();

      return orderDetails;

    }) ;

    _ord.total = _order.total;
     
    return _ord;
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
                unit_id : detail.unit_id,
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