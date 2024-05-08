
export interface ISignup{
    firstName:string;
    lastName:string;
    email:string;
    login:string;
    password:string;
    s_cut:string;
}

export interface ICredential{
    login:string;
    password:string;
    rememberMe:boolean;
}

export interface ITokenLogin{
    token:string | Blob;
}

export interface ILogin{
    login:string;
}

export interface IUniqueLogin{
    id:string;
}

export interface IVerifyOTP{
    login:string;
    otp:string;
}

export interface INewPassword{
    login:string;
    password:string;
}



