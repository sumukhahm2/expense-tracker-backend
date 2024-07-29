
const Auth=require('../model/auth')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Sequelize=require('sequelize')
const sequelize = require('../database/database')

postSignUpAuthentication=async (req,res,next)=>{
    const t=await sequelize.transaction()
    try{
    const data={
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        isPremium:false,
        totalExpenses:0
    }  

    const isEmailExists=await checkCredentials(req.body.email,'email')
    const isUsernameExists=await checkCredentials(req.body.username,'username')
    if(isEmailExists || isUsernameExists)
    {
        if(isEmailExists)
         res.status(409).json({error:'Email Already Exists'})
       else
         res.status(409).json({error:'Username Already Exists'})
    }
    else{
       bcrypt.hash(data.password,10,async (err,hash)=>{
        console.log(err)
         const response=await Auth.create({...data,password:hash},{transaction:t})
         if(response.error)
         {
            t.rollback()
            console.log(response.error)
         }
         else{
             t.commit()
            res.status(201).json({message:'User Created Successfully'})
         }
         
    })
 
    }  
   }
    catch(error){
        t.rollback()
       res.status(500).json({error:error}) 
        
    }

}

postLoginAuthentication=async (req,res,next)=>{
    const t=await sequelize.transaction()
   
    try{
        const users=await Auth.findAll({where:{email:req.body.email},transaction:t})
           
            if(users.length==0)
                res.status(404).json({error:'User Not Found'})
            else
            {
                bcrypt.compare(req.body.password,users[0].password,(err,response)=>{
                    if(err)
                    {
                         t.rollback()
                        res.status(500).json({error:'Something Went Wrong'})
                    }
                        
                    else if(response)
                    {
                         t.commit()
                        res.status(201).json({message:'User Login Successfully',token:generateAccessToken(users[0].id,false)})
                    }
                     
                    else
                    {
                        t.rollback()
                        res.status(401).json({error:'Authentication Failed!'})
                    }
                   
                }) 
            }
    }
    catch(error){
        console.log(error)
    }
 
    
}


getPremiumUser=async (req,res,next)=>{

    res.status(201).json({user:req.user})
}


const checkCredentials=(data,type)=>{
    if(type=='email')
    {
      
        return new Promise(async(resolve,reject)=>{
              try{
             let user= await Auth.findOne({where:{email:data}})
              if(user)
                resolve(true)
              resolve(false)
        }
        catch(err){
            reject(err)
        }
         
        })
       
    }
    else{
         return new Promise(async(resolve,reject)=>{
              try{
             let user= await Auth.findOne({where:{username:data}})
              if(user)
                resolve(true)
              resolve(false)
        }
        catch(err){
            reject(err)
        }
         
        })
    }
}

 generateAccessToken=(id,isPremium)=>{
   return jwt.sign({authId:id,isPremium:isPremium},'wuCCWAcqs7yGQm82QhuXTJep6hRqMUdZQfqSFaVSZHwY3I5kHLpRqWRtFdRKDqJ')
}

module.exports={generateAccessToken,getPremiumUser,postLoginAuthentication,postSignUpAuthentication}