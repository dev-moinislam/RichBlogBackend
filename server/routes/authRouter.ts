import express from 'express'
import authCtrl from '../controllers/authCtrl'
import { validateRegister, validateResetPassword } from '../middleware/validate'

const router=express.Router()

router.post('/register',validateRegister,authCtrl.register)
router.post('/active', authCtrl.activateAccount)
router.post('/login', authCtrl.login)
router.post('/forgot_password', authCtrl.forgotPassword)
router.put('/reset_password',validateResetPassword, authCtrl.resetPassword)
router.post('/google_login', authCtrl.googleLogin)





export default router