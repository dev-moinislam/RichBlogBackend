import { Request } from "express"
import { Document } from "mongoose"

export interface ILoginUser extends Document{
    username:string,
    account:string,
    password:string,
    avatar:string,
    role:string,
    type:string,
    _doc:object,

}

export interface IRegisteredUser{
    username:string,
    account:string,
    passrord:string
}

export interface IDecodedToken{
    id?:string,
    registeredUser?:IRegisteredUser,
    iat?:number,
    exp?:number
}

export interface IReqAuth extends Request {
    user?: ILoginUser
}

export interface IGgPayload {
    email: string
    email_verified: boolean
    name: string
    picture: string
}

export interface IUserParams {
    username: string 
    account: string 
    password: string
    avatar?: string
    type: string
  }