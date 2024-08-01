import React from 'react'
import {Container,Table} from 'react-bootstrap'
import moment from 'moment'
const ShowReport=(props)=>{
     const totalExpenses=props.expense.reduce((total,num)=>{
        console.log(total+" "+num)
           return total+num.expenseAmount
     },0)
     
    return(
        <Container>
            <h3>{props.month}</h3>
           <Table striped bordered hover variant="" >
      <thead >
        <tr >
          <th className="bg-info">Date</th>
          <th className="bg-info">Description</th>
          <th className="bg-info">Category  </th>
          <th className="bg-info ">Income Amount</th>
          <th className="bg-info ">Expense Amount</th>
        </tr>
      </thead>
      <tbody>
        {props.expense.map(item=>
        <tr key={item.id}>
           <td>{moment(item.createdAt).utc().format('DD-MM-YYYY')}</td>
           <td>{item.description}</td>
           <td>{item.category}</td>
           <td>0</td>
           <td>{item.expenseAmount}</td>
        </tr>)      
          }
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td className='fw-bold'>Total Expenses</td>
            <td className='fw-bold'>{totalExpenses}</td>
          </tr>
      </tbody>
      </Table>
        </Container> 
    )
}

export default ShowReport