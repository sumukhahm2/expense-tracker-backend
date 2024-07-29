const jwt=require('jsonwebtoken')

const Auth=require('../model/auth')



const authentication=async(req,res,next)=>{

    try{
    console.log()
    const token=req.header('Authorization')
    console.log('token '+token)
    const data=jwt.verify(token,'wuCCWAcqs7yGQm82QhuXTJep6hRqMUdZQfqSFaVSZHwY3I5kHLpRqWRtFdRKDqJ')
   // console.log(user)
    const user=await Auth.findByPk(data.authId)
      
    req.user=user
    console.log('authuser '+req.user)
    next() 
    }
    catch(error){
        console.log(error)
    }

}

module.exports={authentication}