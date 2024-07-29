const router=require('express').Router()
const orderControler=require('../controler/order')
const authentication=require('../middleware/authentication')

router.get('/expense/buy-premium',authentication.authentication,orderControler.purchsePremium)

router.post('/expense/update-transaction',authentication.authentication,orderControler.updateTransaction)

module.exports=router