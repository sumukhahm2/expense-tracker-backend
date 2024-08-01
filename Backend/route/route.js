const router=require('express').Router()
const AuthControler=require('../controler/auth')
const ExpenseControler=require('../controler/expense')
const UserAuthenticate=require('../middleware/authentication')

router.post('/user/auth-signup',AuthControler.postSignUpAuthentication)

router.post('/user/auth-login',AuthControler.postLoginAuthentication)

router.post('/expense/add-expense',UserAuthenticate.authentication,ExpenseControler.postExpense)

router.get('/expense/get-expense',UserAuthenticate.authentication,ExpenseControler.getExpenses)

router.delete('/expense/delete-expense/:id',UserAuthenticate.authentication,ExpenseControler.deleteExpense)

router.get('/user/get-premium',UserAuthenticate.authentication,AuthControler.getPremiumUser)

router.get('/expense/download-expense',UserAuthenticate.authentication,ExpenseControler.downloadExpenses)

router.get('/expense/get-allexpenses',ExpenseControler.getAllExpenses)

module.exports=router