const Sib=require('sib-api-v3-sdk')
const Auth=require('../model/auth')
const uuid=require('uuid')
const ForgotPasswordRequest=require('../model/forgotPasswordRequest')
const bcrypt=require('bcrypt')
const { where } = require('sequelize')
require('dotenv').config()

exports.sendForgotPasswordEmail=async(req,res,next)=>{
 try{   
const email=req.body.email
console.log(email)
const user=await Auth.findOne({where:{email:email}})
console.log(user)
if(user)
{
    console.log('found')
  const uid=uuid.v4() 

  user.createForgotpasswordrequest({id:uid,isActive:true})
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
    textContent:'Your Password Reset Link',
    htmlContent:`<div><h3>Your Password Reset Link</h3><a href="http://localhost:4000/password/create-password/${uid}">Link</a></div>`

})
.then(result=>{
    res.status(201).json({message:'A Password Reset Link Send to Your Email Please Check...!'})
})
}
else{
    console.log('not found')
    return res.json({error:'User Not Found'})
}
 }
 catch(err){
    console.log(err)
     return res.json({error:err})
 }
}  


exports.createPassword=async (req,res,next)=>{
    try{
        const uid=req.params.id
         const user=await ForgotPasswordRequest.findOne({attributes:['id','isActive','authId'],where:{id:uid}})
          console.log(user)
         if(user && user.dataValues.isActive)
         {
            user.update({isActive:false})
            const id=user.dataValues.authId
            res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>

            <form action="/password/update-password/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
            </form>
        </html>`)
         }
         else{
           return res.json({error:'Link Expired'})
         }

    }
    catch(error){
        return res.json({error:error})
    }
    



}


exports.updatePassword=async (req,res,next)=>{

    try{
        const {newpassword}=req.query
        console.log(newpassword)
        const id=req.params.id
        const user=await Auth.findOne({where:{id:id}})
        if(user)
        {
           bcrypt.hash(newpassword,10,async(err,hash)=>{
             if(err)
            console.log(err)
             else{
               await user.update({password:hash})
               res.status(201).send('password updated successfully')
             }

        })
    }
    else 
      res.status(404).send('User Not Found')

    }
    catch(error)
    {

    }


}