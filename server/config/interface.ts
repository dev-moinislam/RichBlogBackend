import { Document } from "mongoose"

export interface ILoginUser extends Document{
    name:string,
    account:string,
    password:string,
    avatar:string,
    role:string,
    type:string,
    refresh_token?:string,
    _doc:object,

}

export interface IRegisteredUser{
    name:string,
    account:string,
    passrord:string
}

export interface IDecodedToken{
    id?:string,
    registeredUser?:IRegisteredUser,
    iat:number,
    exp:number
}