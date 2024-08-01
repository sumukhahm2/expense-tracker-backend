const Expense=require('../model/expense')
const Auth=require('../model/auth')
const jwt=require('jsonwebtoken')
const sequelize=require('../database/database')
const AWS=require('aws-sdk')

async function upLoadToS3(data,fileName){

    const BUCKET_NAME='expensestrackers'
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET

    let s3Bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,

    })

    
        var params={
            Bucket:BUCKET_NAME,
            Key:fileName,
            Body:data,
            ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3Bucket.upload(params,(err,s3Response)=>{
                if(err)
                {
                    console.log(err)
                    reject(err)
                }
                else{
                    console.log(s3Response)
                    resolve(s3Response.Location)
                }
            })
        
        })
       
}
exports.downloadExpenses=async(req,res)=>{
    const expenses=await req.user.getExpenses()

    const stringifiedExpenses=JSON.stringify(expenses)
    const fileName=`Expense${req.user.id}/${new Date()}.csv`
    const fileURL=await upLoadToS3(stringifiedExpenses,fileName)
    res.status(200).json({url:fileURL})

}

exports.postExpense=async(req,res,next)=>{
   
    const t=await sequelize.transaction()
    const data=jwt.verify(req.body.token,'wuCCWAcqs7yGQm82QhuXTJep6hRqMUdZQfqSFaVSZHwY3I5kHLpRqWRtFdRKDqJ')
    const expenseData={
        expenseAmount:req.body.expenseAmount,
        description:req.body.description,
        category:req.body.category,
        authId:data.authId
       }

    try{
         const expense=await Expense.create(expenseData,{transaction:t})
         if(expense)
         {
            const total=Number(req.user.totalExpenses)+Number(expenseData.expenseAmount)
           const user=await Auth.update(
            {totalExpenses:total},
            {where:{id:req.user.id},transaction:t} )
           
            if(user)
            {
                t.commit()
                res.status(201).json({expenses:expense.dataValues})
            }
             else{
                t.rollback()
                
             }  
           }
                  
    }
    catch(error){
        await t.rollback()
        console.log(error)
    }
   


}



exports.getExpenses=async(req,res,next)=>{
    try{
    const expenses= await req.user.getExpenses()
   
     res.status(201).json({expenseData:expenses})
    }
    catch(error){
        console.log(error)
    }
}

exports.getAllExpenses=async(req,res,next)=>{
    try{
        const expenses=await Auth.findAll({
            attributes:['id','username','totalExpenses'],
            include:[
                {
                    model:Expense,
                    attributes:[]
                }
            ],
            group:['auth.id'],
            order:[['totalExpenses','DESC']]
        }) 
       
       res.status(201).json({expenses:expenses})
    }
    catch(error){
        console.log(error)
    }
}

exports.deleteExpense=async(req,res,next)=>{
    const t=await sequelize.transaction()
   try{ 
   const result= await Expense.findByPk(req.params.id,{transaction:t})
   const prevAmt=await req.user.totalExpenses
 
   const totalAmt=Number(prevAmt)-Number(result.dataValues.expenseAmount)
   const user=req.user.update({totalExpenses:Math.abs(totalAmt)})
   if(user)
   {
    result.destroy()
    t.commit()
    res.status(201).json({message:'Expense Deleted Successfully'})
   }
   
   }
   catch(error){
    t.rollback()
    console.log(error)
   }
} 


