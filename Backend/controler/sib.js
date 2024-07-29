const Sib=require('sib-api-v3-sdk')

require('dotenv').config()

exports.sendForgotPasswordEmail=(req,res,next)=>{
const email=req.body.email
const client=Sib.ApiClient.instance
const apiKey=client.authentications['api-key']

apiKey.apiKey=process.env.API_KEY

const tranEmailApi=new Sib.TransactionalEmailsApi()

const sender={
    email:'sumukhahm2@gmail.com' 
}

const reciever=[{
   email:email
}]

tranEmailApi.sendTransacEmail({
    sender,
    to:reciever,
    subject:'hello learn Javascript ',
    textContent:'learn from our academy for best practice'
})
.then(console.log)
.catch(error=>{    
    console.log('error'+error)
})
}        