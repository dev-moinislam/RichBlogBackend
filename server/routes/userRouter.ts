import express from 'express'
import userCtrl from '../controllers/userCtrl'

const router = express.Router()

router.post('/user/update',  userCtrl.updateUser)

router.post('/user/update_password', userCtrl.updatePassword)



export default router;