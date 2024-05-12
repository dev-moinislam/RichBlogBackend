import { Request, Response, NextFunction } from "express";


// Email validation Function
  export function validateEmail(email:string) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase());
    }

// Full User Validation Function
export const validateRegister=async(req:Request,res:Response,next:NextFunction)=>{
  const {username,account,password}=req.body

  const errors=[]

//validate  users username   
  if(!username){
    errors.push('Please add your username')
  }else if(username.lenght>20){
    errors.push('Your username is up to 20 chars long.')
  }

//   validate user account
if(!account){
  errors.push('Please add you accound')
}else if(!validateEmail(account)){
  errors.push('Email format is incorrect.')

}

// validate user password
if(!password){
  errors.push('Please enter your password')
}else if(password.length<6){
  errors.push('password must be atleast 6 character')
}

if(errors.length>0){
  res.status(400).json({
    msg:errors
  })
  console.log(errors)
}else{
  next()
}
}


/* --------------------------- reset Pass validate -------------------------- */
export const validateResetPassword=async(req:Request,res:Response,next:NextFunction)=>{
  const {password}=req.body

  //make a error array and push error message when error occourd
  const errors=[]


 if(password.length<6){
  errors.push('password must be atleast 6 character')
}

if(errors.length>0){
  res.status(400).json({
    msg:errors
  })
  console.log(errors)
}else{
  next()
}
}


