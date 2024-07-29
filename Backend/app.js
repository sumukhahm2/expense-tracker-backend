const path=require('path')

const express=require('express')

const bodyParser=require('body-parser')

const sequelize= require('./database/database')


const authRoute=require('./route/route')

const orderRoute=require('./route/order')

const passwordRoute=require('./route/password')

const cors=require('cors');

const Auth=require('./model/auth')

const Expense=require('./model/expense')

const Order=require('./model/order')

require('dotenv').config()


const app = express();


app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

Auth.hasMany(Expense)
Expense.belongsTo(Auth)

Auth.hasMany(Order)
Order.belongsTo(Auth)

app.use(authRoute)
app.use(orderRoute)
app.use(passwordRoute)

sequelize.sync()
.then(result=>{ 
    //console.log(result) 
    app.listen(4000)
})
.catch((error)=>{
    console.log(error) 
})

 