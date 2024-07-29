const router=require('express').Router()

const sibController=require('../controler/sib')


router.post('/password/forgotpassword',sibController.sendForgotPasswordEmail)

module.exports=router 