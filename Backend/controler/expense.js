const Expense=require('../model/expense')
const Auth=require('../model/auth')
const jwt=require('jsonwebtoken')
const sequelize=require('../database/database')

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


