import { Request, Response } from 'express'
import Users from '../models/userModel'
import bcrypt from 'bcrypt'


const userCtrl = {
  updateUser: async (req: Request, res: Response) => {

    try {
      const { avatar, username, account} = req.body
      await Users.findOneAndUpdate({account:account}, {
        avatar,
        username
      })

      res.json({ account,msg: "Update Success!" })
    } catch (err: any) {
      return res.status(500).json({msg: err.message})
    }
  },
  updatePassword: async (req: Request, res: Response) => {
    try {
      const { account,password } = req.body
      const passwordHash = await bcrypt.hash(password, 12)

      await Users.findOneAndUpdate({account: account}, {
        password: passwordHash
      })

      res.json({ msg: "Your password is updated now" })
    } catch (err: any) {
      return res.status(500).json({msg: err.message})
    }
  },
//   getUser: async (req: Request, res: Response) => {
//     try {
//       const user = await Users.findById(req.params.id).select('-password')
//       res.json(user)
//     } catch (err: any) {
//       return res.status(500).json({msg: err.message})
//     }
//   }
}


export default userCtrl;