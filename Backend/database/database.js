const {Sequelize}=require('sequelize')

const sequelize=new Sequelize('node_complete','root','Thirthahalli@1',
{
    dialect:'mysql',
    host:'localhost'
}
)

module.exports=sequelize;