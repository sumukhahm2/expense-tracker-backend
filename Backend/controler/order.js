const Razorpay=require('razorpay')
const Order=require('../model/order')
const userControler=require('../controler/auth')

exports.purchsePremium=(req,res,next)=>{
 
    try{
       const rzp=new Razorpay({
        key_id:process.env.RAZOR_PAY_KEY_ID,
        key_secret:process.env.RAZOR_PAY_KEY_SECRET
       })
       const amount=2500
      
       rzp.orders.create({amount,currency:'INR'},async(err,order)=>{
        if(err){
           console.log(err)
        } 
        else{
          console.log(order)
            const ordr=await req.user.createOrder({OrderId:order.id,status:'PENDING'})
           if(ordr)
          {
            console.log(ordr)
            return res.status(201).json({order,key_id:rzp.key_id})
          }
          else
          throw new Error(err)
        }
       })
    }
    catch(error){
        console.log(error)
    }
}

exports.updateTransaction=async (req,res,next)=>{
    try{  
      console.log('updating transaction')
       const {payment_id,order_id}=req.body
       const order=await Order.findOne({where:{OrderId:order_id}})
       if(order)
       {
        const result=await order.update({paymentId:payment_id,status:'SUCCESSFUL'})
         if(result)
         {
            const user=await req.user.update({isPremium:true})
            return res.status(201).json({message:'Transaction Successful',token:userControler.generateAccessToken(user.id,true)})
         }
       }
       else{

       }             
}
catch(err){
    console.log(err)
}


}