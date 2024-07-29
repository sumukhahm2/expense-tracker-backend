const sequelize=require('../database/database')
 const Sequelize=require('sequelize')

const Auth=sequelize.define('auth',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    username:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
        
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password: { 
        type:Sequelize.STRING,
        allowNull:false,
        
},
 isPremium:{
    type:Sequelize.BOOLEAN,
    allowNull:false,
 },
 totalExpenses:{
    type:Sequelize.INTEGER
 }
})

module.exports=Auth