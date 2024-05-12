import jwt from 'jsonwebtoken'

export const generateActiveToken=(payloda:object)=>{
    return jwt.sign(payloda,`${process.env.ACTIVE_TOKEN_SECRET}`,{expiresIn:'5m'})
}

export const generateAccessToken=(payloda:object)=>{
    return jwt.sign(payloda,`${process.env.ACCESS_TOKEN_SECTER}`,{expiresIn:'15m'})
}

export const generateRefreshToken=(payloda:object)=>{
    return jwt.sign(payloda,`${process.env.REFRESH_TOKEN_SECRET}`,{expiresIn: '30d'})
}