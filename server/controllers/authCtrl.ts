import { IDecodedToken, IGgPayload, ILoginUser, IUserParams } from './../config/interface';
import { Request,Response } from "express";
import Users from '../models/userModel'
import bcrypt from 'bcrypt';
import {generateAccessToken, generateActiveToken} from '../config/tokenGenerate'
import sendEmail from '../config/sendMail'
import { validatePhone,validateEmail } from "../middleware/validate";
import sendSMS from "../config/sendSms";
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library';


const CLIENT_URL=`${process.env.BASE_URL}`
const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`)



const authCtrl={
    register:async(req:Request,res:Response)=>{
        try{
            const {username,account,password}=req.body
            const user=await Users.findOne({account})
            if(user) return res.status(400).json({msg:'Phone number or email is already exist'})
            const hashPass=await bcrypt.hash(password,12)
            
            const registeredUser={
                username,
                account,
                password:hashPass
            }

            const active_token=generateActiveToken({registeredUser})
            
            const url=`${CLIENT_URL}/active/${active_token}/`

            if(validateEmail(account)){
                sendEmail(account,url,"Verify your Email adress",username)
                res.json({msg:"Please check you Email to verify your account"})
            }
            else if(validatePhone(account)){
                sendSMS(account,url,"Verify your Phone Number",username)
                res.json({msg:"Please check you Phone number to verify your account"})
            }

            
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

    forgotPassword: async(req: Request, res: Response) => {
        try {
          const { account } = req.body
    
          const user = await Users.findOne({account})
          if(!user)
            return res.status(400).json({msg: 'This account does not exist.'})
    
          if(user.type !== 'register')
            return res.status(400).json({
              msg: `Quick login account with ${user.type} can't use this function.`
            })
    
          const access_token = generateAccessToken({id: user._id})
    
          const url = `${CLIENT_URL}/reset_password/${access_token}/`
    
          if(validatePhone(account)){
            sendSMS(account, url, "Forgot password?",user.username)
            return res.json({msg: "Success! Please check your phone."})
    
          }else if(validateEmail(account)){
            sendEmail(account, url, "Forgot password?",user.username)
            return res.json({msg: "Success! Please check your email."})
          }
    
        } catch (err: any) {
          return res.status(500).json({msg: err.message})
        }
      },
      resetPassword: async (req: Request, res: Response) => {

    
        try {
          const { access_token,password }:{ access_token: string; password: string } = req.body

            if(!access_token) return res.status(400).json({msg: "Invalid Authentication."})

            const decoded=<IDecodedToken>jwt.verify(access_token,`${process.env.ACCESS_TOKEN_SECTER}`)

            if(!decoded) return res.status(400).json({msg: "Invalid Authentication."})

            const user:ILoginUser =<ILoginUser> await Users.findOne({_id: decoded.id}).select("-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})

            if(password.length<6){
              res.json('password must be atleast 6 character')
            }

            const passwordHash = await bcrypt.hash(password, 12)
 
            await Users.findOneAndUpdate({_id: user._id}, {
              password: passwordHash
            })
    
          res.json({ msg: "Reset Password Success!" })
        } catch (err: any) {
            console.log(err.message)

          return res.status(500).json({msg: err.message})
          
        }
      },
      googleLogin: async(req: Request, res: Response) => {
        try {
          const { credential } = req.body

          const verify = await client.verifyIdToken({
            idToken: credential, audience: `${process.env.MAIL_CLIENT_ID}`
          })
    
          const {
            email, email_verified, name, picture
          } = <IGgPayload>verify.getPayload()

    
          if(!email_verified)
            return res.status(500).json({msg: "Email verification failed."})
    
          const password = email + 'your google secrect password'
          const passwordHash = await bcrypt.hash(password, 12)
    
          const user = await Users.findOne({account: email})
    
          if(user){
            loginUser(user, password, res)
          }else{
            const user:IUserParams = {
              username:name, 
              account: email, 
              password: passwordHash, 
              avatar: picture,
              type: 'google'
            }
            registerUser(user, res)
          }
          
        } catch (err: any) {
          return res.status(500).json({msg: err.message})
        }
      },
}



const loginUser=async(user:ILoginUser,password:string,res:Response)=>{
    const isMatch=await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        return res.status(400).json({msg:"Password is incorrect"})
    }

    const access_token=generateAccessToken({id:user._id})

    res.json({
        msg:"User is successfully Login",
        access_token,
        user:{...user._doc,password:''}
    })
}


const registerUser = async (user: IUserParams, res: Response) => {
  const newUser = new Users(user)

  const access_token = generateAccessToken({id: newUser._id})

  await newUser.save()

  res.json({
    msg: 'Login Success!',
    access_token,
    user: { ...newUser._doc, password: '' }
  })

}


export default authCtrl;