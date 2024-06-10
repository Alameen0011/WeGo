import express from 'express'
import {registerController,loginController,testController,forgotPasswordController} from '../controller/authController.js'
import { requiredSignIn,isAdmin } from '../middlewares/authMiddleware.js';

//router obje

const router = express.Router()

//routing
//register|| METHOD POST\\

router.post('/register', registerController);

//login || METHOD POST//

router.post('/login',loginController);

//Forgot Passowrd || POST

router.post('/forgot-password', forgotPasswordController);



//test Routes
router.get('/test',requiredSignIn, isAdmin ,testController)

//protected  user route auth
router.get('/user-auth', requiredSignIn, (req,res) =>{
    res.status(200).send({ok:true});
})
//protected admin  route auth
router.get('/admin-auth', requiredSignIn, isAdmin, (req,res) =>{
    res.status(200).send({ok:true});
})






export default router