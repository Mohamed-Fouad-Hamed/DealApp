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

export interface ICategoryPost{
    id:number;
    name:string;
    descr:string;
    account_type:string;
}

export interface ICategoryGet{
    id:number;
    name:string;
    descr:string;
    img:string;
    account_type:string;
}

export interface IProductRequest{
    id:number;
    name:string;
    descr:string;
    has_first:boolean;
    first_unit:string;
    first_price:number;
    has_second:boolean;
    second_unit:string;
    second_price:number;
    category_id:number;
}

export interface IProductResponse{
    id:number;
    name:string;
    descr:string;
    has_first:boolean;
    first_unit:string;
    first_price:number;
    has_second:boolean;
    second_unit:string;
    second_price:number;
    category_id:number;
    product_image:string;
}