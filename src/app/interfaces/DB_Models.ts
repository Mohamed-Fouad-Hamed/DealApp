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