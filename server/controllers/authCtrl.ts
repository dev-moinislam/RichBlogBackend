import { IDecodedToken, ILoginUser } from './../config/interface';
import { Request,Response } from "express";
import Users from '../models/userModel'
import bcrypt from 'bcrypt';
import {generateAccessToken, generateActiveToken, generateRefreshToken} from '../config/tokenGenerate'
import sendEmail from '../config/sendMail'
import { validatePhone,validateEmail } from "../middleware/validate";
import sendSMS from "../config/sendSms";
import jwt from 'jsonwebtoken'
import { generateKeyPairSync } from 'crypto';

const CLIENT_URL=`${process.env.BASE_URL}`



const authCtrl={
    register:async(req:Request,res:Response)=>{
        try{
            const {name,account,password}=req.body
            const user=await Users.findOne({account})
            if(user) return res.status(400).json({msg:'Phone number or email is already exist'})
            const hashPass=await bcrypt.hash(password,12)
            
            const registeredUser={
                name,
                account,
                password:hashPass
            }

            /* ---------- when user verify/activate their account then this section work --------- */
            // registered user save to database
            // registeredUser.save().then((registeredUser)=>{
            //     console.log('User is Saved successgully',registeredUser)
            // }).catch((err)=>{
            //     console.log('Error saving user:',err)

            // })

            const active_token=generateActiveToken({registeredUser})
            
            const url=`${CLIENT_URL}/active/${active_token}`

            if(validateEmail(account)){
                sendEmail(account,url,"Verify your Email adress",name)
                res.json({msg:"Please check you Email to verify your account"})
            }else if(validatePhone(account)){
                sendSMS(account,url,"Verify your Phone Number",name)
                res.json({msg:"Please check you Phone number to confirm"})
            }

            // res.json({
            //     status:'OK',
            //     msg:'User is registered successfully',
            //     userData:registeredUser,
            //     active_token
            // })
        }catch(err:any){
            return res.status(500).json({
                msg:err.message
            })
        }
    },
    activateAccount:async(req:Request,res:Response)=>{
        try{
           const {active_token}=req.body

           const decoded=<IDecodedToken>jwt.verify(active_token,`${process.env.ACTIVE_TOKEN_SECRET}`)

           const {registeredUser}=decoded

           if(!registeredUser) return res.json({msg:'Invalid authentication'})


           const activatedUser=new Users(registeredUser)
           await activatedUser.save()

           res.json({msg:'Account has been successfully activated'})

        }catch(err:any){
            let errorMsg;
            if(err.code===11000){
                errorMsg=err.keyValue.account + " is already registered"
            }
            return res.status(500).json({
                msg:errorMsg
            })
        }
    },
    login:async(req:Request,res:Response)=>{
        try{
         const {account,password}=req.body
         const user:ILoginUser=<ILoginUser>await Users.findOne({account})

         if(!user) return res.status(400).json({msg:'This user is not registerd'})

        //  if user exist it call login user function
        loginUser(user,password,res)


        }catch(err:any){
            return res.status(500).json({
                msg:err.message
            })
        }
    },
    logout:async(req:Request,res:Response)=>{
        try{
            res.clearCookie('refreshtoken',{path:'/api/refresh_token'})
            
            return res.json({msg:'Successfully Logged out'})
        }catch(err:any){
            return res.status(500).json({
                msg:err.message
            })
        }
    },
    refreshToken:async(req:Request,res:Response)=>{
        try{
           const rf_token=req.cookies.refreshtoken
           if(!rf_token) {
             return res.status(400).json({msg:"Please Login"})
           }

           const decoded=<IDecodedToken>jwt.verify(rf_token,`${process.env.REFRESH_TOKEN_SECRET}`)
           if(!decoded.id) {
            return res.status(400).json({msg:"Please Login"})
           }
            
           const user=<ILoginUser>await Users.findById(decoded.id).select("-password")
           if(!user) {
            return res.status(400).json({msg:"Account does't exist"})
           }
           
           const access_token=generateAccessToken({id:user._id})
           
           res.json({access_token})
        }catch(err:any){
            return res.status(500).json({
                msg:err.message
            })
        }
    },
}

const loginUser=async(user:ILoginUser,password:string,res:Response)=>{
    const isMatch=await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        return res.status(400).json({msg:"Password is incorrect"})
    }

    const access_token=generateAccessToken({id:user._id})
    const refresh_token=generateRefreshToken({id:user._id})
    
    res.cookie('refreshtoken',refresh_token,{
        httpOnly:true,
        path:'/api/refresh_token',
        maxAge:30*24*60*60*1000
    })

    res.json({
        msg:"User is successfully Login",
        access_token,
        user:{...user._doc,password:''}
    })
}
export default authCtrl;