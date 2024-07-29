import React, { Fragment,useState} from "react";
import { Container,Table,Button } from "react-bootstrap";
import {  useSelector,useDispatch } from "react-redux";
import { expenseAction } from "../store/expenseSlice";

const ExpenseList=()=>{
    const [message,setMessage]=useState(null)
  const expenses=useSelector(state=>state.expense.expenses)
  const dispatch=useDispatch()

 
  const deleteExpense=async(id)=>{
    
    const res=await fetch(`http://localhost:4000/expense/delete-expense/${id}`,{
        method:'DELETE',
        headers:{
          'Authorization':localStorage.getItem('token')
        }
    })

    const data=await res.json()

     dispatch(expenseAction.deleteExpense(id))
     setMessage(data.message)

  }
    return(
        <Fragment>
           <Container>
            {}
           <Table striped bordered hover variant="" >
      <thead >
        <tr >
          <th className="bg-info ">Expense Amount</th>
          <th className="bg-info">Description</th>
          <th className="bg-info">Category  </th>
          <th className="bg-info">Action  </th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(item=>
        <tr key={item.id}>
          <td>{item.expenseAmount}</td>
          <td>{item.description}</td>
          <td>{item.category}</td>
          <td><Button className="btn-danger" onClick={deleteExpense.bind(null,item.id)}>Delete</Button></td>
        </tr>
         )}
      </tbody>
    </Table>
           </Container>
         </Fragment> 
    )
}

export default ExpenseList