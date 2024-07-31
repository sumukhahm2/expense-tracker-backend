import {React,Fragment,useRef,useState} from "react";

import { Form,Button, Container, Row, Col} from "react-bootstrap";
import ExpenseList from "./ExpenseList";
import { useDispatch,useSelector } from "react-redux";
import { expenseAction } from "../store/expenseSlice";
import { authAction } from "../store/authSlice";
import ShowLeaderBoard from "./showLeaderBoard";
import { leaderboardAction } from "../store/leaderboardSlice";
import Razorpay from 'razorpay'

//Razorpay loadscript 
const loadScript=(src)=>{

  return new Promise((resolve)=>{
    const script=document.createElement('script')
    script.src=src
    script.onload=()=>{
      resolve(true)
    }
    script.onerror=()=>{
      resolve(false)
    }
    document.body.appendChild(script)
  })

}
const ExpenseHome=()=>{

  const [isLeaderBoaerd,setLeaderBoard]=useState(false)
  const [isReport,getReport]=useState(false)
  const isPremium=useSelector(state=>state.auth.isPremium)

  const amountRef=useRef()
  const descriptionRef=useRef()
  const categoryRef=useRef()

  const dispatch=useDispatch()

  //addExpense function to add expense to expense table.
  const addExpense=async(event)=>{
    event.preventDefault() 
     const expenseData={
      expenseAmount:amountRef.current.value,
      description:descriptionRef.current.value,
      category:categoryRef.current.value,
      token:localStorage.getItem('token')
     }
     //console.log(expenseData)
   const res=await fetch('http://localhost:4000/expense/add-expense',{
    method:'POST',
    body:JSON.stringify(expenseData),
    headers:{
      'Content-Type':'application/json',
      'Authorization':localStorage.getItem('token')
    }
   })

   const data=await res.json()
   console.log(data)

   dispatch(expenseAction.addExpense(data.expenses))
   setLeaderBoard(false)

  }

  //buyPremium function which is used to connect with Razorpay and display the Razorpay ui on frontend
  const buyPremium=async(e)=>{

    const result=await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if(!result){
      alert('Something went wrong')
      return
    }
     
      const res=await fetch('http://localhost:4000/expense/buy-premium',{
         method:'GET',
         headers:{
           'Authorization':localStorage.getItem('token') 
         }

      })
     const data=await res.json()
     console.log(data)
      var option={
        'key_id':data.key_id,
        'order_id':data.order.id,
        'handler':async function (response){
          //console.log(response)
          const result=await fetch('http://localhost:4000/expense/update-transaction',{
            method:'POST',
            body:JSON.stringify({
              order_id:response.razorpay_order_id,
              payment_id:response.razorpay_payment_id,
            }),
            headers:{
              'Content-Type':'application/json',
              'Authorization':localStorage.getItem('token') 
            }
          })
         const dta=await result.json()
         console.log(dta)
         if(dta.token)
         {
          dispatch(authAction.setPremium({token:dta.token}))
           alert('You Are A Premium User Now')
         }
         else
         {
           alert(dta.message)
           return
         } 
        }
      }
      const rzp1= new window.Razorpay(option)
      console.log(rzp1)
      rzp1.open()
      e.preventDefault()

      //console.log(await res.json())
  }

  //ShowLeaderBoard function to show the leaderboard in descending order
  const showLeaderBoard=async()=>{
      const res=await fetch('http://localhost:4000/expense/get-allexpenses',{
        method:'GET'
      })
      const data=await res.json()
      console.log(data.expenses)
      dispatch(leaderboardAction.addExpense(data.expenses))
      setLeaderBoard(true)

  }
  
    return(
        <Fragment>
          <Row>
            <Col className="col-8">
            <Container className="d-flex justify-content-center mb-3">
            <Form onSubmit={addExpense}>
                <Form.Text className="text-warning fs-1 fw-bold">Add Expense Details</Form.Text>
      <Form.Group className="mb-3 " controlId="expenseAmount">
        <Form.Label className="fw-bold">Expense Amount</Form.Label>
        <Form.Control type="number" placeholder="Enter Expense Amount" className="border border-warning" ref={amountRef}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="ExpenseDescription">
        <Form.Label className="fw-bold">Description</Form.Label>
        <Form.Control type="text" placeholder="Enter Description" className="border border-warning" ref={descriptionRef}/>
      </Form.Group>
      <Form.Label className="fw-bold">Category</Form.Label>
      <Form.Select aria-label="Default select example" className="mb-3 border border-warning" ref={categoryRef}>
      <option>Select Category--</option>
      <option value="food">Food</option>
      <option value="shoping">Shoping</option>
      <option value="traveling">Traveling</option>
      <option value="other">Other</option>
    </Form.Select>
      <Button variant="warning" type="submit" className="text-light fw-bold" >
        Add Expense
      </Button>
    </Form>
    </Container>
    </Col>
    <Col>
       {!isPremium && <Button variant="primary" onClick={buyPremium}>Buy Premium</Button>}
       {isPremium && <div><h4>You Are A Premium User</h4><Button className="mb-3" onClick={!isLeaderBoaerd?showLeaderBoard:()=>{setLeaderBoard(false)}}>{!isLeaderBoaerd?'Show LeaderBoard':'Hide LeaderBoard'}</Button></div>}
       {isPremium && <a href="/report"  className=" border border-black text-decoration-none bg-success text-light ">Generate Report</a>}
       </Col>
    </Row>
       <ExpenseList/>
       {isLeaderBoaerd && <ShowLeaderBoard />}
       {}
        </Fragment>
    )
}

export default ExpenseHome