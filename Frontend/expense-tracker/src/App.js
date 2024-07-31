
import './App.css';
import {React,useEffect} from 'react';
import {Navigate, Route,Routes} from 'react-router-dom'
import Login from './components/Login';
import ExpenseHome from './components/ExpenseHome';
import { UseSelector, useSelector,useDispatch } from 'react-redux';
import { authAction } from './store/authSlice';
import { expenseAction } from './store/expenseSlice';
import Report from './components/reports/Report';

function App() {

   const dispatch=useDispatch()
  useEffect(()=>{
      if(localStorage.getItem('email'))
       dispatch(authAction.stayLogin())
       
  },[])

  useEffect(()=>{
    async function checkPremium(){
      const res= await fetch('http://localhost:4000/user/get-premium',{
        method:'GET',
        headers:{
         'Authorization':localStorage.getItem('token') 
        }
      })
      const data=await res.json()
      console.log(data.user.isPremium)
      if(data.user.isPremium)
         dispatch(authAction.setPremium({token:localStorage.getItem('token')}))
    }
    checkPremium()
  },[])

  useEffect(()=>{
      async function getExpense(){
         const res=await fetch('http://localhost:4000/expense/get-expense',{
          method:'GET',
          headers:{
            'Authorization':localStorage.getItem('token')
          }
         })
         const data=await res.json()
         console.log(data)
         dispatch(expenseAction.addExpense(data.expenseData)) 
      }
      
      getExpense()
  },[])
  const isLogin=useSelector(state=>state.auth.isLogin)
  console.log(isLogin)
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <main className='app-main'>
        <Routes>
        <Route path={isLogin?'/':'/add-expense'} element={isLogin?<Navigate to='/add-expense'/>:<Navigate to='/'/>}/>
           <Route path='/' element={<Login/>}/>
           <Route path='/add-expense' element={<ExpenseHome/>}/>
           <Route path='/report' element={<Report/>}/>
           
        </Routes>
      </main>
    </div>
  );
}

export default App;
