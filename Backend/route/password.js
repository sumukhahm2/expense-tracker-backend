const router=require('express').Router()

const sibController=require('../controler/sib')


router.post('/password/forgotpassword',sibController.sendForgotPasswordEmail)

router.get('/password/create-password/:id',sibController.createPassword)

router.get('/password/update-password/:id',sibController.updatePassword)

module.exports=router 