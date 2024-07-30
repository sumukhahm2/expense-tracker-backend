const sequelize=require('../database/database')
 const Sequelize=require('sequelize')

const ForgotPasswordRequest=sequelize.define('forgotpasswordrequest',{
    id:{
        type:Sequelize.UUID, 
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:Sequelize.STRING,
        
    },
    
    isActive: { 
        type:Sequelize.BOOLEAN,
}
})

module.exports=ForgotPasswordRequest