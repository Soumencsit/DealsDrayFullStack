
import express from 'express'
import {loginAdmin,signUpAdmin,verifyOTP,resendOTPVerificationCode} from '../controllers/adminController.js'
const createRoute=express.Router();

createRoute.post('/login',loginAdmin)
createRoute.post('/signup',signUpAdmin)
createRoute.post('/verifyOTP',verifyOTP)
createRoute.post('/resendOTP',resendOTPVerificationCode)



export default createRoute;
