import mongoose from 'mongoose'
import { ILoginUser } from '../config/interface'


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add your name"],
    trim: true,
    maxLength: [20, "Your name is up to 20 chars long."]
  },
  account: {
    type: String,
    required: [true, "Please add your email or phone"],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please add your password"]
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/richblogcloud/image/upload/v1677128588/profile.png'
  },
  role: {
    type: String,
    default: 'user' // admin 
  },
  type: {
    type: String,
    default: 'register' // login
  },
}, {
  timestamps: true
})

export default mongoose.model<ILoginUser>('User', userSchema)